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
import { CEOSignature, DirectorSignature, TravidoxSignature } from '@/components/ui/signature'

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
      
      // Wait a moment for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create a high-quality canvas from the certificate element
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Even higher quality for professional output
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: certificateRef.current.offsetWidth,
        height: certificateRef.current.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: certificateRef.current.offsetWidth,
        windowHeight: certificateRef.current.offsetHeight
      })
      
      // Create PDF in landscape format with better dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: false // Better quality
      })
      
      // Calculate dimensions to fit the certificate properly while maintaining aspect ratio
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgAspectRatio = canvas.width / canvas.height
      const pdfAspectRatio = pdfWidth / pdfHeight
      
      let finalWidth, finalHeight, imgX, imgY
      
      if (imgAspectRatio > pdfAspectRatio) {
        // Image is wider than PDF
        finalWidth = pdfWidth * 0.95 // 95% of page width for margins
        finalHeight = finalWidth / imgAspectRatio
        imgX = (pdfWidth - finalWidth) / 2
        imgY = (pdfHeight - finalHeight) / 2
      } else {
        // Image is taller than PDF
        finalHeight = pdfHeight * 0.95 // 95% of page height for margins
        finalWidth = finalHeight * imgAspectRatio
        imgX = (pdfWidth - finalWidth) / 2
        imgY = (pdfHeight - finalHeight) / 2
      }
      
      // Convert canvas to high-quality image and add to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95) // Use JPEG with high quality
      pdf.addImage(imgData, 'JPEG', imgX, imgY, finalWidth, finalHeight)
      
      // Generate a clean filename with user's name
      const cleanUserName = certificate.userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
      const cleanCourseTitle = (courseData?.title || certificate.courseName).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
      const filename = `Travidox_Certificate_${cleanCourseTitle}_${cleanUserName}_${new Date().getFullYear()}.pdf`
      
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
          <Card className="p-1 overflow-hidden shadow-2xl">
            <div 
              ref={certificateRef} 
              className="bg-white p-16 min-h-[700px] flex flex-col items-center justify-center relative print:shadow-none"
              style={{ fontFamily: 'Georgia, Times, serif' }}
            >
              {/* Elegant Border Frame */}
              <div className="absolute inset-8 border-4 border-double border-amber-300"></div>
              <div className="absolute inset-12 border border-amber-200"></div>
              
              {/* Watermark Pattern */}
              <div className="absolute inset-0 opacity-3">
                <div className="absolute top-20 left-20">
                  <Image src="/logo.png" alt="Travidox" width={80} height={80} className="opacity-10" />
                </div>
                <div className="absolute top-20 right-20">
                  <Image src="/logo.png" alt="Travidox" width={80} height={80} className="opacity-10" />
                </div>
                <div className="absolute bottom-20 left-20">
                  <Image src="/logo.png" alt="Travidox" width={80} height={80} className="opacity-10" />
                </div>
                <div className="absolute bottom-20 right-20">
                  <Image src="/logo.png" alt="Travidox" width={80} height={80} className="opacity-10" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image src="/logo.png" alt="Travidox" width={200} height={200} className="opacity-5" />
                </div>
              </div>
              
              <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
                {/* Header Section */}
                <div className="mb-16">
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                        <Image src="/logo.png" alt="Travidox" width={40} height={40} className="object-contain" />
                      </div>
                      <div className="text-left">
                        <h1 className="text-4xl font-bold text-amber-600 tracking-wider" style={{ fontFamily: 'Georgia, Times, serif' }}>
                          TRAVIDOX
                        </h1>
                        <p className="text-lg text-gray-600 font-medium tracking-wide">LEARNING EXCELLENCE PLATFORM</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Award Icon */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl">
                        <Award className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full -z-10 opacity-30"></div>
                      <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full -z-20 opacity-20"></div>
                    </div>
                  </div>
                </div>
                
                {/* Main Certificate Title */}
                <div className="mb-12">
                  <h2 className="text-6xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Georgia, Times, serif' }}>
                    CERTIFICATE
                  </h2>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                    <p className="text-2xl text-amber-600 font-semibold tracking-widest">OF</p>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, Times, serif' }}>
                    EXCELLENCE
                  </h3>
                </div>
                
                {/* Recognition Text */}
                <div className="mb-12">
                  <p className="text-2xl text-gray-700 mb-8 font-medium" style={{ fontFamily: 'Georgia, Times, serif' }}>
                    This is to certify that
                  </p>
                  
                  {/* User Name - Main Focus */}
                  <div className="mb-8 py-6 px-8 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-lg border-l-4 border-r-4 border-amber-400">
                    <h3 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 leading-tight" 
                        style={{ fontFamily: 'Georgia, Times, serif' }}>
                      {certificate.userName}
                    </h3>
                  </div>
                  
                  <p className="text-2xl mb-8 text-gray-700 font-medium" style={{ fontFamily: 'Georgia, Times, serif' }}>
                    has successfully completed the comprehensive course
                  </p>
                  
                  {/* Course Title */}
                  <div className="mb-12 py-4 px-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-3xl font-bold text-gray-800 leading-relaxed" style={{ fontFamily: 'Georgia, Times, serif' }}>
                      {courseData.title}
                    </h4>
                  </div>
                  
                  <p className="text-xl text-gray-600 mb-12" style={{ fontFamily: 'Georgia, Times, serif' }}>
                    demonstrating exceptional knowledge, dedication, and mastery of the subject matter
                  </p>
                </div>
                
                {/* Certificate Details Grid */}
                <div className="grid grid-cols-3 gap-8 mb-16">
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200 shadow-sm">
                    <p className="text-amber-700 text-sm font-bold uppercase tracking-wider mb-3">Completion Date</p>
                    <p className="font-bold text-xl text-gray-800" style={{ fontFamily: 'Georgia, Times, serif' }}>
                      {formatDate(certificate.issueDate)}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 shadow-sm">
                    <p className="text-green-700 text-sm font-bold uppercase tracking-wider mb-3">Certificate ID</p>
                    <p className="font-bold text-xl text-gray-800 font-mono">
                      {certificate.id.substring(0, 12).toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm">
                    <p className="text-blue-700 text-sm font-bold uppercase tracking-wider mb-3">Verification Code</p>
                    <p className="font-bold text-xl text-gray-800 font-mono">
                      {certificate.verificationCode}
                    </p>
                  </div>
                </div>
                
                                 {/* Signature Section */}
                 <div className="grid grid-cols-3 gap-12 mb-16">
                   <div className="text-center">
                     <div className="mb-4 flex justify-center">
                       <CEOSignature className="transform scale-90" />
                     </div>
                     <div className="border-t-2 border-gray-400 pt-4 mb-2">
                       <p className="font-bold text-lg text-gray-800" style={{ fontFamily: 'Georgia, Times, serif' }}>Dr. Sarah Johnson</p>
                       <p className="text-gray-600 font-medium">Chief Education Officer</p>
                       <p className="text-sm text-gray-500">Travidox Learning Platform</p>
                     </div>
                   </div>
                   
                   <div className="text-center">
                     <div className="mb-4 flex justify-center">
                       <TravidoxSignature className="transform scale-110" />
                     </div>
                     <div className="border-t-2 border-amber-400 pt-4 mb-2">
                       <p className="font-bold text-xl text-amber-600" style={{ fontFamily: 'Georgia, Times, serif' }}>TRAVIDOX</p>
                       <p className="text-gray-700 font-semibold">Official Certification Seal</p>
                       <p className="text-sm text-gray-500">Authorized Learning Institution</p>
                     </div>
                   </div>
                   
                   <div className="text-center">
                     <div className="mb-4 flex justify-center">
                       <DirectorSignature className="transform scale-90" />
                     </div>
                     <div className="border-t-2 border-gray-400 pt-4 mb-2">
                       <p className="font-bold text-lg text-gray-800" style={{ fontFamily: 'Georgia, Times, serif' }}>Michael Chen</p>
                       <p className="text-gray-600 font-medium">Director of Certifications</p>
                       <p className="text-sm text-gray-500">Travidox Learning Platform</p>
                     </div>
                   </div>
                 </div>
                
                {/* Footer */}
                <div className="pt-8 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Image src="/logo.png" alt="Travidox" width={32} height={32} className="opacity-70" />
                      <div className="text-left">
                        <p className="text-sm text-gray-600 font-medium">
                          Verify this certificate at:
                        </p>
                        <p className="text-sm font-bold text-amber-600">www.travidox.com/verify</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Issued by Travidox Learning Platform
                      </p>
                      <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Travidox. All rights reserved.
                      </p>
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