'use client'

import Spline from '@splinetool/react-spline'

export default function SplineScene() {
  return (
    <div className="w-full h-[500px] relative">
      {/* Replace this URL with your own from Step 2 */}
      <Spline 
        scene="https://app.spline.design/community/file/4a505c53-7caf-4ceb-84ab-f5d2007aa26e" 
      />
    </div>
  )
}