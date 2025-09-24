import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ReviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Review Problems */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-2 w-2 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
