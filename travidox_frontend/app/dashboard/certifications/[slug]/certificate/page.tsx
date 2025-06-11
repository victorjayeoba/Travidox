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
  
  // Download certificate as image
  const handleDownload = async () => {
    if (!certificateRef.current || !certificate) return
    
    try {
      setGenerating(true)
      
      // Create a link element
      const link = document.createElement('a')
      
      // Set link properties
      link.download = `Travidox_Certificate_${courseData.title.replace(/\s+/g, '_') || certificate.courseName.replace(/\s+/g, '_')}.png`
      
      // Open certificate in a new tab to allow the user to download/print it
      const certificateWindow = window.open('', '_blank')
      
      if (certificateWindow) {
        // Write certificate HTML to the new window
        certificateWindow.document.write(`
          <html>
            <head>
              <title>Travidox Certificate - ${courseData.title || certificate.courseName}</title>
              <style>
                body { margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; }
                .certificate-container { border: 8px solid #fde68a; padding: 2rem; width: 100%; max-width: 800px; margin: 2rem auto; background-color: white; }
                .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .brand { font-size: 1.5rem; font-weight: bold; color: #059669; }
                .title { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; font-family: serif; }
                .subtitle { color: #6b7280; margin-bottom: 2rem; }
                .name { font-size: 2.25rem; font-weight: bold; margin: 2rem 0; color: #92400e; font-family: serif; }
                .course-name { font-size: 1.75rem; font-weight: bold; margin: 2rem 0; font-family: serif; }
                .details { display: flex; justify-content: center; gap: 3rem; text-align: center; }
                .details-label { color: #6b7280; font-size: 0.875rem; }
                .footer { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
                .verification { font-size: 0.875rem; color: #6b7280; }
                .verification-code { font-family: monospace; }
                .print-button { margin-top: 2rem; padding: 0.75rem 1.5rem; background-color: #059669; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 1rem; }
                @media print {
                  .print-button { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="certificate-container">
                <div class="header">
                  <div class="brand">${certificate.brandedName || 'TRAVIDOX'}</div>
                  <div>Certificate of Excellence</div>
                </div>
                <div class="title">Certificate of Completion</div>
                <div class="subtitle">This certifies that</div>
                <div class="name">${certificate.userName}</div>
                <div>has successfully completed the course</div>
                <div class="course-name">${courseData.title || certificate.courseName}</div>
                <div class="details">
                  <div>
                    <div class="details-label">Issue Date</div>
                    <div>${formatDate(certificate.issueDate)}</div>
                  </div>
                  <div>
                    <div class="details-label">Certificate ID</div>
                    <div>${certificate.id.substring(0, 8)}</div>
                  </div>
                </div>
                <div class="footer">
                  <div class="verification">
                    Verify this certificate using code: 
                    <span class="verification-code">${certificate.verificationCode}</span>
                  </div>
                  <div class="brand">${certificate.brandedName || 'TRAVIDOX'}</div>
                </div>
              </div>
              <button class="print-button" onclick="window.print()">Print / Save as PDF</button>
            </body>
          </html>
        `)
        
        toast.success('Certificate opened in new tab - use Print or Save as PDF')
      } else {
        toast.error('Please allow pop-ups to download the certificate')
      }
      
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
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Get Certificate
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
                {/* Travidox Logo & Branding */}
                <div className="flex justify-between items-center mb-8">
                  <div className="text-xl font-bold text-green-600">{certificate.brandedName || 'TRAVIDOX'}</div>
                  <div className="flex justify-center">
                    <Award className="h-16 w-16 text-amber-600" />
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Certificate of Excellence
                  </div>
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
                      {formatDate(certificate.issueDate)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm">Certificate ID</p>
                    <p className="font-medium">{certificate.id.substring(0, 8)}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Verify this certificate at <span className="font-mono">verification code: {certificate.verificationCode}</span>
                    </p>
                    <div className="text-green-600 font-bold">{certificate.brandedName || 'TRAVIDOX'}</div>
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