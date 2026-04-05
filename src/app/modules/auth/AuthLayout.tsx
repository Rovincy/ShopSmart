
import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
      {/* begin::Body */}
      <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* begin::Wrapper */}
          <div className='w-lg-500px p-10'>
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Form */}

        
      </div>
      {/* end::Body */}

      {/* begin::Aside */}
      <div
  className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-5 order-lg-2'
  style={{
    backgroundImage: `url(${toAbsoluteUrl('/media/logos/afs.jpg')})`,
    position: 'relative', // Make sure the container is positioned relatively
  }}
>
  {/* Black overlay */}
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black color with 50% opacity
    }}
  ></div>

  {/* Foreground image */}
  <div
    style={{
      position: 'absolute',
      top: '10%', // Adjust top position to move it to the top center
      left: '50%', // Move it to the center horizontally
      transform: 'translate(-50%, -50%)', // Center it properly
      width: '80px', // Adjust width and height to create a circular shape
      height: '80px',
      borderRadius: '50%', // Make it circular
      backgroundImage: `url(${toAbsoluteUrl('/media/logos/HR_Logo.jpg')})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  ></div>
</div>


      {/* <div
  className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-5 order-lg-2'
  style={{
    backgroundImage: `url(${toAbsoluteUrl('media/logos/hr.jpg')})`,
    position: 'relative', // Make sure the container is positioned relatively
  }}
>
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black color with 50% opacity
    }}
  ></div>
      </div> */}
      {/* end::Aside */}
    </div>
  )
}

export {AuthLayout}





// import {useEffect} from 'react'
// import {Outlet, Link} from 'react-router-dom'
// import {toAbsoluteUrl} from '../../../_metronic/helpers'

// const AuthLayout = () => {
//   useEffect(() => {
//     const root = document.getElementById('root')
//     if (root) {
//       root.style.height = '100%'
//     }
//     return () => {
//       if (root) {
//         root.style.height = 'auto'
//       }
//     }
//   }, [])

//   return (
//     <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
//       {/* begin::Body */}
//       <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
//         {/* begin::Form */}
//         <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
//           {/* begin::Wrapper */}
//           <div className='w-lg-500px p-10'>
//             <Outlet />
//           </div>
//           {/* end::Wrapper */}
//         </div>
//         {/* end::Form */}

//         {/* begin::Footer */}
//         <div className='d-flex flex-center flex-wrap px-5'>
//           {/* begin::Links */}
//           <div className='d-flex fw-semibold text-primary fs-base'>
//             <a href='#' className='px-5' target='_blank'>
//               Terms
//             </a>

//             <a href='#' className='px-5' target='_blank'>
//               Plans
//             </a>

//             <a href='#' className='px-5' target='_blank'>
//               Contact Us
//             </a>
//           </div>
//           {/* end::Links */}
//         </div>
//         {/* end::Footer */}
//       </div>
//       {/* end::Body */}

//       {/* begin::Aside */}
//       <div
//         className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
//         style={{backgroundImage: `url(${toAbsoluteUrl('media/misc/auth-bg.png')})`}}
//       >
//         {/* begin::Content */}
//         <div className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100'>
//           {/* begin::Logo */}
//           <Link to='/' className='mb-12'>
//             <img alt='Logo' src={toAbsoluteUrl('media/logos/custom-1.png')} className='h-75px' />
//           </Link>
//           {/* end::Logo */}

//           {/* begin::Image */}
//           <img
//             className='mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20'
//             src={toAbsoluteUrl('media/misc/auth-screens.png')}
//             alt=''
//           />
//           {/* end::Image */}

//           {/* begin::Title */}
//           <h1 className='text-white fs-2qx fw-bolder text-center mb-7'>
//             Fast, Efficient and Productive
//           </h1>
//           {/* end::Title */}

//           {/* begin::Text */}
//           <div className='text-white fs-base text-center'>
//             In this kind of post,{' '}
//             <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
//               the blogger
//             </a>
//             introduces a person they’ve interviewed <br /> and provides some background information
//             about
//             <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
//               the interviewee
//             </a>
//             and their <br /> work following this is a transcript of the interview.
//           </div>
//           {/* end::Text */}
//         </div>
//         {/* end::Content */}
//       </div>
//       {/* end::Aside */}
//     </div>
//   )
// }

// export {AuthLayout}
