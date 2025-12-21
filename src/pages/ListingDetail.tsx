import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/Navbar";
import { PurchaseDialog } from "@/components/PurchaseDialog";
import { RatingDialog } from "@/components/RatingDialog";
import { RatingsList } from "@/components/RatingsList";
import { StarRating } from "@/components/ui/star-rating";
import { useListing, usePurchaseListing, useUser } from "@/hooks/useApi";
import { useCreateChat } from "@/hooks/use-chat";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";
import {
  MessageCircle,
  Flag,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Tag,
  Loader2,
  ShoppingCart,
  Trash2,
  UserX,
  User,
  Shield,
} from "lucide-react";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);

  // Fetch listing data from API
  const { data: listing, isLoading, error } = useListing(id!);
  const { data: user } = useUser();
  const { user: authUser } = useAuth();
  const purchaseMutation = usePurchaseListing();
  const createChatMutation = useCreateChat();

  // Admin handlers
  const handleDeleteListing = async () => {
    if (!id) return;
    try {
      await adminApi.deleteListing(id);
      toast.success("Listing deleted successfully");
      navigate("/admin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete listing"
      );
    }
  };

  const handleBanUser = async () => {
    if (!listing?.seller_id) return;
    try {
      await adminApi.banUser(listing.seller_id);
      toast.success("User banned successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to ban user"
      );
    }
  };

  const handleViewUserProfile = () => {
    if (listing?.seller_id) {
      navigate(`/admin/user/${listing.seller_id}`);
    }
  };

  const handlePurchase = async (quantity: number) => {
    if (!user) {
      toast.error("Please log in to make a purchase");
      navigate("/auth");
      return;
    }

    try {
      const result = await purchaseMutation.mutateAsync({ id: id!, quantity });
      toast.success(
        `Purchase successful! Transaction ID: ${result.data.transaction_id}`
      );
      setIsPurchaseDialogOpen(false);
      // Optionally redirect or show more details
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Purchase failed";
      toast.error(errorMessage);
    }
  };

  const handleContactSeller = async () => {
    if (!user) {
      toast.error("Please log in to contact the seller");
      navigate("/auth");
      return;
    }

    if (!listing?.seller_id) {
      toast.error("Seller information not available");
      return;
    }

    try {
      const newChat = await createChatMutation.mutateAsync({
        participant_a_id: user.id,
        participant_b_id: listing.seller_id,
      });

      toast.success("Chat started successfully!");
      // Navigate with initial message as URL param so Messages component can send it
      navigate(
        `/messages?chat=${newChat._id}&initial=${encodeURIComponent(
          `Hi! I'm interested in your listing: ${listing.title}`
        )}`
      );
    } catch (error: any) {
      // If chat already exists, just navigate to messages
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already exists")
      ) {
        navigate("/messages");
        toast.info("Redirected to your existing conversation");
      } else {
        toast.error(error.response?.data?.detail || "Failed to start chat");
      }
    }
  };

  // Redirect if no ID provided
  if (!id) {
    navigate("/browse", { replace: true });
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex items-center justify-center py-20">
          <div className="flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg">Loading listing...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20">
          <Card className="mx-auto max-w-md p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Listing Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              {error
                ? "Failed to load listing details."
                : "This listing doesn't exist or has been removed."}
            </p>
            <Link to="/browse">
              <Button>Back to Browse</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Prepare images array - handle both single image and array formats
  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800"];

  // Reset current image if it's out of bounds
  if (currentImage >= images.length) {
    setCurrentImage(0);
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <Link to="/browse">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="relative mb-4 overflow-hidden rounded-lg bg-muted">
              <div className="aspect-square">
                <img
                  src={images[currentImage]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 rounded-md bg-background/80 px-2 py-1 text-sm">
                  {currentImage + 1} / {images.length}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                      currentImage === index
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}{" "}
            {/* Description */}
            <Card className="mt-8 p-6 max-h-72 overflow-y-auto">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                {listing.description}
              </p>
            </Card>
            {/* Safety Tips */}
            <Card className="mt-4 border-accent/20 bg-accent/5 p-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Safety Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Meet in a public place on campus</li>
                <li>• Inspect the item before purchasing</li>
                <li>• Never share financial information via messages</li>
                <li>• Report suspicious listings immediately</li>
              </ul>
            </Card>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">{listing.category}</Badge>
                  {!listing.is_sold && !listing.is_reported && (
                    <Badge
                      variant="outline"
                      className="border-success/20 bg-success/10 text-success"
                    >
                      Available
                    </Badge>
                  )}
                  {listing.is_sold && (
                    <Badge
                      variant="outline"
                      className="border-destructive/20 bg-destructive/10 text-destructive"
                    >
                      Sold
                    </Badge>
                  )}
                  {listing.is_reported && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500/20 bg-yellow-500/10 text-yellow-600"
                    >
                      Reported
                    </Badge>
                  )}
                </div>
              </div>

              <h1 className="mb-4 text-2xl font-bold text-foreground">
                {listing.title}
              </h1>

              {/* Rating Display */}
              <div className="mb-4">
                {listing.average_rating ? (
                  <div className="flex items-center gap-2">
                    <StarRating rating={listing.average_rating} size="sm" />
                    <span className="text-sm font-medium">
                      {listing.average_rating}/5
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({listing.total_ratings}{" "}
                      {listing.total_ratings === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <StarRating rating={0} size="sm" />
                    <span className="text-sm text-muted-foreground">N/A</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">
                  ${listing.price}
                </span>
                <div className="mt-2">
                  <Badge variant="outline" className="text-sm">
                    {listing.stock} available
                  </Badge>
                </div>
              </div>

              <div className="mb-6 space-y-3 text-sm">
                {listing.condition && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Condition: {listing.condition}</span>
                  </div>
                )}
                {listing.pickup_location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.pickup_location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDate(listing.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{listing.views} views</span>
                </div>
              </div>

              {/* Tags */}
              {listing.tags && listing.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* Seller Info */}
              <div className="mb-6">
                <h3 className="mb-4 font-semibold">Seller Information</h3>
                <Link to={`/user/${listing.seller_id}`}>
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {listing.seller_name
                          ? listing.seller_name.charAt(0).toUpperCase()
                          : listing.seller_email?.charAt(0).toUpperCase() ||
                            "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {listing.seller_name ||
                            listing.seller_email ||
                            "Anonymous User"}
                        </span>
                        <ShieldCheck className="h-4 w-4 text-success" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Click to view seller's profile
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="space-y-3">
                {!listing.is_sold && user && listing.seller_id !== user.id ? (
                  <>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setIsPurchaseDialogOpen(true)}
                      disabled={listing.stock === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={handleContactSeller}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message Seller
                    </Button>
                  </>
                ) : listing.is_sold ? (
                  <Button className="w-full" size="lg" disabled>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Item Sold
                  </Button>
                ) : listing.seller_id === user?.id ? (
                  <Button className="w-full" size="lg" disabled>
                    <Tag className="mr-2 h-4 w-4" />
                    Your Listing
                  </Button>
                ) : (
                  <Link to="/auth">
                    <Button className="w-full" size="lg">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Login to Purchase
                    </Button>
                  </Link>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: listing.title,
                          text: listing.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>

                {/* Admin Actions */}
                {authUser?.is_admin && (
                  <div className="mt-6 pt-6 border-t border-destructive/20">
                    <p className="text-xs font-medium text-destructive mb-3 flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      Admin Actions
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                        onClick={handleViewUserProfile}
                      >
                        <User className="mr-2 h-4 w-4" />
                        View Seller Profile
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleBanUser}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Ban Seller
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleDeleteListing}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Listing
                      </Button>
                    </div>
                  </div>
                )}

                {/* Rate Item Button - only show for logged in users who didn't sell this item */}
                {user && listing.seller_id !== user.id && (
                  <div className="mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsRatingDialogOpen(true)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Rate this Item
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Browse More */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Explore More</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Find more items in the {listing.category} category
              </p>
              <Link
                to={`/browse?category=${encodeURIComponent(listing.category)}`}
              >
                <Button variant="outline" className="w-full">
                  Browse {listing.category}
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="mt-8">
          <RatingsList listingId={id} />
        </div>

        {/* Purchase Dialog */}
        {user && listing && (
          <PurchaseDialog
            isOpen={isPurchaseDialogOpen}
            onOpenChange={setIsPurchaseDialogOpen}
            listing={{
              id: listing.id,
              title: listing.title,
              price: listing.price,
              stock: listing.stock || 0,
              seller_name: listing.seller_name,
            }}
            userBalance={user.balance}
            onConfirmPurchase={handlePurchase}
            isLoading={purchaseMutation.isPending}
          />
        )}

        {/* Rating Dialog */}
        {user && listing && listing.seller_id !== user.id && (
          <RatingDialog
            isOpen={isRatingDialogOpen}
            onOpenChange={setIsRatingDialogOpen}
            listingId={id}
            listingTitle={listing.title}
          />
        )}
      </div>
    </div>
  );
}
