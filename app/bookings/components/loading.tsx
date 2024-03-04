import { Skeleton } from "@/app/components/ui/skeleton";

const LoadingBookings = () => {
  return (
    <div>
      <Skeleton className="w-[150px] h-[20px] mt-8 ml-5" />
      <Skeleton className="w-[120px] h-[20px] mt-6 ml-5" />

      <div className="px-5 mt-4">
        <Skeleton className="w-full h-[130px]" />
        <Skeleton className="w-full h-[130px] mt-5" />
        <Skeleton className="w-full h-[130px] mt-5" />
        <Skeleton className="w-full h-[130px] mt-5" />
      </div>
    </div>
  );
};

export default LoadingBookings;
