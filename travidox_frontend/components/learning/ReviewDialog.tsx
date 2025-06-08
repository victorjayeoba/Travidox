import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, review: string) => void;
  initialRating?: number;
}

export function ReviewDialog({ open, onOpenChange, onSubmit, initialRating = 5 }: ReviewDialogProps) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    onSubmit(rating, review);
    setRating(initialRating);
    setReview("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Module Review</DialogTitle>
          <DialogDescription>
            Please share your thoughts about this module
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  variant={rating === value ? "default" : "outline"}
                  size="icon"
                  onClick={() => setRating(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Review</Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this module..."
              className="mt-2"
            />
          </div>
          
          <Button className="w-full" onClick={handleSubmit}>
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 