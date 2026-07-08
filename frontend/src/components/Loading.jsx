import React from 'react'

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[80vh] text-2xl font-semibold text-gray-400">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  )
}

export default Loading