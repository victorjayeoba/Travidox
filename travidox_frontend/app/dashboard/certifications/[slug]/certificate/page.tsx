"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Share2, Award, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { fetchCourseProgress, getCertificate, Certificate} from '@/lib/firebase-courses'
import { getCourseById } from '@/lib/course-data'
import { toast } from 'sonner'

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
  
  // Download certificate as PDF
  const handleDownload = async () => {
    if (!certificateRef.current) return
    
    try {
      setGenerating(true)
      
      // Mock PDF generation
      setTimeout(() => {
        toast.success('Certificate downloaded successfully')
        setGenerating(false)
      }, 1500)
    } catch (error) {
      console.error('Error generating PDF:', error)
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
                variant="outline" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button
                onClick={handleDownload}
                disabled={generating}
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
              className="bg-gradient-to-r from-blue-50 to-purple-50 text-center p-12 min-h-[500px] flex flex-col items-center justify-center"
            >
              <div className="border-8 border-amber-100 p-8 w-full max-w-4xl mx-auto bg-white bg-opacity-90">
                <div className="flex justify-center mb-6">
                  <Award className="h-16 w-16 text-amber-600" />
                </div>
                
                <h2 className="text-2xl font-serif mb-1">Certificate of Completion</h2>
                <p className="text-gray-600 mb-8">This certifies that</p>
                
                <h3 className="text-3xl font-bold mb-8 text-amber-800 font-serif">
                  {certificate.userName}
                </h3>
                
                <p className="text-lg mb-8">
                  has successfully completed the course
                </p>
                
                <h3 className="text-2xl font-bold mb-8 font-serif">
                  {courseData.title}
                </h3>
                
                <div className="flex justify-center gap-12 text-center">
                  <div>
                    <p className="text-gray-600 text-sm">Issue Date</p>
                    <p className="font-medium">
                      {new Date(certificate.issueDate.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm">Certificate ID</p>
                    <p className="font-medium">{certificate.id.substring(0, 8)}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Verify this certificate at <span className="font-mono">verification code: {certificate.verificationCode.substring(0, 8)}</span>
                  </p>
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
                Your achievement is officially recognized. Share your success with potential employers and colleagues.
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