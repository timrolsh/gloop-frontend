
export default function Skeleton({ className = '', loading = false, width = '100%', height = '40px', children }) {
  return (
    <>
      {loading ? (
        <div
          style={{
            height: height,
            width: width,
          }}
          className={`position-relative ${className}`}>
          <div
            className={`rounded h-100 w-100 ${loading ? 'd-block' : 'd-none'}`}
            style={{
              backgroundColor: '#373737',
              animation: 'pulse 1.5s ease-in-out infinite',
              borderRadius: '0.375rem',
            }}
          ></div>
        </div>
      ) : (
        children
      )}
    </>
  )
}
