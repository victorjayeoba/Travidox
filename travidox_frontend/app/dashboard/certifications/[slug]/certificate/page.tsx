"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Share2, Award, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { fetchCourseProgress, getCertificate, Certificate } from '@/lib/firebase-courses'
import { getCourseById } from '@/lib/course-data'
import { toast } from 'sonner'
import Image from 'next/image'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function CertificatePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const certificateRef = useRef<HTMLDivElement>(null)
  
  // Find the course data based on the slug
  const courseData = getCourseById(slug)

  // Load the certificate
  useEffect(() => {
    const loadCertificate = async () => {
      if (!user?.uid || !courseData) return
      
      try {
        setLoading(true)
        // Get course progress to find certificate ID
        const progress = await fetchCourseProgress(user.uid, courseData.id)
        
        if (!progress?.certificateId) {
          // No certificate found, redirect back to course
          toast.error('No certificate found for this course')
          router.push(`/dashboard/certifications/${slug}`)
          return
        }
        
        // Get certificate details
        const certificateData = await getCertificate(progress.certificateId)
        if (certificateData) {
          setCertificate(certificateData)
        } else {
          toast.error('Certificate not found')
          router.push(`/dashboard/certifications/${slug}`)
        }
      } catch (error) {
        console.error('Error loading certificate:', error)
        toast.error('Failed to load certificate')
      } finally {
        setLoading(false)
      }
    }
    
    loadCertificate()
  }, [user?.uid, courseData, router, slug])
  
  // Format date nicely
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.toDate());
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // Download certificate as PDF automatically
  const handleDownload = async () => {
    if (!certificateRef.current || !certificate) return
    
    try {
      setGenerating(true)
      
      // Create a high-quality canvas from the certificate element
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: certificateRef.current.offsetWidth,
        height: certificateRef.current.offsetHeight
      })
      
      // Create PDF in landscape format
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      // Calculate dimensions to fit the certificate properly
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = (pdfHeight - imgHeight * ratio) / 2
      
      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      // Generate filename
      const filename = `Travidox_Certificate_${(courseData?.title || certificate.courseName).replace(/\s+/g, '_')}_${certificate.userName.replace(/\s+/g, '_')}.pdf`
      
      // Download the PDF automatically
      pdf.save(filename)
      
      toast.success('Certificate downloaded successfully!')
      setGenerating(false)
    } catch (error) {
      console.error('Error generating certificate:', error)
      toast.error('Failed to download certificate')
      setGenerating(false)
    }
  }
  
  // Share certificate
  const handleShare = async () => {
    if (!certificate) return
    
    try {
      // Mock sharing
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Certificate link copied to clipboard')
    } catch (error) {
      console.error('Error sharing certificate:', error)
      toast.error('Failed to share certificate')
    }
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-gray-500 mb-6">The course you are looking for does not exist.</p>
        <Button onClick={() => router.push('/dashboard/certifications')}>
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.push(`/dashboard/certifications/${slug}`)}
        >
          <ArrowLeft size={16} />
        </Button>
        <span className="text-sm text-gray-500">Back to course</span>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading certificate...</p>
        </div>
      ) : certificate ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Certificate</h1>
              <p className="text-gray-600 mt-1">
                Congratulations on completing {courseData.title}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                disabled={generating}
                className="bg-green-600 hover:bg-green-700"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download PDF
              </Button>
            </div>
          </div>
          
          {/* Certificate Display */}
          <Card className="p-1 overflow-hidden">
            <div 
              ref={certificateRef} 
              className="bg-gradient-to-br from-blue-50 via-white to-green-50 text-center p-12 min-h-[600px] flex flex-col items-center justify-center relative"
            >
              <div className="border-8 border-gradient-to-r from-amber-200 to-yellow-300 p-12 w-full max-w-5xl mx-auto bg-white shadow-2xl relative overflow-hidden">
                
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-8 left-8">
                    <Image src="/logo.png" alt="Travidox" width={60} height={60} className="opacity-30" />
                  </div>
                  <div className="absolute top-8 right-8">
                    <Image src="/logo.png" alt="Travidox" width={60} height={60} className="opacity-30" />
                  </div>
                  <div className="absolute bottom-8 left-8">
                    <Image src="/logo.png" alt="Travidox" width={60} height={60} className="opacity-30" />
                  </div>
                  <div className="absolute bottom-8 right-8">
                    <Image src="/logo.png" alt="Travidox" width={60} height={60} className="opacity-30" />
                  </div>
                </div>
                
                {/* Header with Logo */}
                <div className="flex justify-between items-center mb-12 relative z-10">
                  <div className="flex items-center space-x-3">
                    <Image src="/logo.png" alt="Travidox Logo" width={48} height={48} className="object-contain" />
                    <div className="text-left">
                      <div className="text-2xl font-bold text-green-600 tracking-wider">{certificate.brandedName || 'TRAVIDOX'}</div>
                      <div className="text-sm text-gray-600 font-medium">Learning Platform</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full -z-10 opacity-30"></div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-700">Certificate of</div>
                    <div className="text-xl font-bold text-amber-600">Excellence</div>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="relative z-10">
                  <h2 className="text-4xl font-serif mb-3 text-gray-800 font-bold">Certificate of Completion</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8"></div>
                  
                  <p className="text-xl text-gray-600 mb-12 font-medium">This certifies that</p>
                  
                  <h3 className="text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 font-serif leading-tight">
                    {certificate.userName}
                  </h3>
                  
                  <p className="text-xl mb-8 text-gray-700 font-medium">
                    has successfully completed the course
                  </p>
                  
                  <h3 className="text-3xl font-bold mb-12 font-serif text-gray-800 leading-relaxed max-w-3xl mx-auto">
                    {courseData.title}
                  </h3>
                  
                  {/* Certificate Details */}
                  <div className="flex justify-center gap-16 text-center mb-12">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                      <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Issue Date</p>
                      <p className="font-bold text-lg text-gray-800">
                        {formatDate(certificate.issueDate)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                      <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Certificate ID</p>
                      <p className="font-bold text-lg text-gray-800">{certificate.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="mt-12 pt-8 border-t-2 border-gray-200 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Image src="/logo.png" alt="Travidox" width={32} height={32} className="opacity-70" />
                      <div className="text-left">
                        <p className="text-sm text-gray-500">
                          Verify at travidox.com with code:
                        </p>
                        <p className="font-mono text-sm font-bold text-gray-700">{certificate.verificationCode}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{certificate.brandedName || 'TRAVIDOX'}</div>
                      <div className="text-sm text-gray-600">Certified Learning Partner</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex items-start gap-4">
            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 mb-1">This certificate is verified and authentic</h3>
              <p className="text-green-700 text-sm">
                Your achievement is officially recognized by Travidox. Share your success with potential employers and colleagues.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-4">No Certificate Found</h1>
          <p className="text-gray-500 mb-6">
            You haven't completed this course yet. Complete all modules to earn your certificate.
          </p>
          <Button onClick={() => router.push(`/dashboard/certifications/${slug}`)}>
            Return to Course
          </Button>
        </div>
      )}
    </div>
  )
} 