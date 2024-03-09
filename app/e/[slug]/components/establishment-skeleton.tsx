import { Skeleton } from "@/app/components/ui/skeleton";

const EstablishmentSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-[250px] rounded-none" />
      <div className="max-w-[1280px] m-auto">
        <Skeleton className="w-6/12 lg:w-2/12 h-[20px] mt-4 ml-2 rounded-md" />
        <Skeleton className="w-6/12 lg:w-2/12 h-[20px] mt-4 ml-2 rounded-md" />

        <div className="flex items-center mt-10 ml-4">
          <Skeleton className="w-3/12 lg:w-1/12 h-[35px] rounded-md" />
          <Skeleton className="w-3/12 lg:w-1/12 h-[35px] ml-2 rounded-md" />
        </div>

        <div className="flex flex-col px-4 mt-8 gap-4">
          <Skeleton className="w-full h-[135px] rounded-md" />
          <Skeleton className="w-full h-[135px] rounded-md" />
          <Skeleton className="w-full h-[135px] rounded-md" />
          <Skeleton className="w-full h-[135px] rounded-md" />
          <Skeleton className="w-full h-[135px] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default EstablishmentSkeleton;
