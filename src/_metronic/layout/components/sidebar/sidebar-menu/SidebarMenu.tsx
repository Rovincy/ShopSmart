import {SidebarMenuMain} from './SidebarMenuMain'

const SidebarMenu = () => {
  return (
    <div className='app-sidebar-menu overflow-hidden flex-column-fluid'>
      <div
        id='kt_app_sidebar_menu_wrapper'
        className='app-sidebar-wrapper hover-scroll-overlay-y my-5'
        data-kt-scroll='true'
        data-kt-scroll-activate='true'
        data-kt-scroll-height='auto'
        data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
        data-kt-scroll-wrappers='#kt_app_sidebar_menu'
        data-kt-scroll-offset='5px'
        data-kt-scroll-save-state='true'
      >
        <div
          className='menu menu-column menu-rounded menu-sub-indention px-3'
          id='kt_app_sidebar_menu' 
          data-kt-menu='true'
          data-kt-menu-expand='false'
        >
          <SidebarMenuMain />
        </div>
      </div>
    </div>
  )
}

export {SidebarMenu}





// import {SidebarMenuMain} from './SidebarMenuMain'

// const SidebarMenu = () => {
//   return (
//     <div className='app-sidebar-menu overflow-hidden flex-column-fluid'>
//       <div
//         id='kt_app_sidebar_menu_wrapper'
//         className='app-sidebar-wrapper hover-scroll-overlay-y my-5'
//         data-kt-scroll='true'
//         data-kt-scroll-activate='true'
//         data-kt-scroll-height='auto'
//         data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
//         data-kt-scroll-wrappers='#kt_app_sidebar_menu'
//         data-kt-scroll-offset='5px'
//         data-kt-scroll-save-state='true'
//       >
//         <div
//           className='menu menu-column menu-rounded menu-sub-indention px-3'
//           id='#kt_app_sidebar_menu'
//           data-kt-menu='true'
//           data-kt-menu-expand='false'
//         >
//           <SidebarMenuMain />
//         </div>
//       </div>
//     </div>
//   )
// }

// export {SidebarMenu}

















// import React, { useState } from 'react';
// import { SidebarMenuMain } from './SidebarMenuMain';

// const SidebarMenu = () => {
//   // Mixing blue and white
//   const [color1, setColor1] = useState('#0000FF'); // Blue
//   const [color2, setColor2] = useState('#FFFFFF'); // White
//   const [mixedColor, setMixedColor] = useState('');

//   // Function to mix colors
//   const mixColors = (color1: any, color2: any) => {
//     const hexToRgb = (hex: any) =>
//       hex
//         .replace(/^#/, '')
//         .match(/.{1,2}/g)
//         .map((x:any) => parseInt(x, 16));

//     const rgbToHex = (r: number, g: number, b: number) =>
//       `#${[r, g, b]
//         .map((x) => x.toString(16).padStart(2, '0'))
//         .join('')}`;

//     const [r1, g1, b1] = hexToRgb(color1);
//     const [r2, g2, b2] = hexToRgb(color2);

//     const mixedR = Math.round((r1 + r2) / 2);
//     const mixedG = Math.round((g1 + g2) / 2);
//     const mixedB = Math.round((b1 + b2) / 2);

//     return rgbToHex(mixedR, mixedG, mixedB);
//   };

//   // Mix colors when component mounts or colors change
//   React.useEffect(() => {
//     const result = mixColors(color1, color2);
//     setMixedColor(result);
//   }, [color1, color2]);

//   return (
//     <div
//       className='app-sidebar-menu overflow-hidden flex-column-fluid'
//       style={{ backgroundColor: mixedColor }}
//     >
//       <div
//         id='kt_app_sidebar_menu_wrapper'
//         className='app-sidebar-wrapper hover-scroll-overlay-y my-5'
//         data-kt-scroll='true'
//         data-kt-scroll-activate='true'
//         data-kt-scroll-height='auto'
//         data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
//         data-kt-scroll-wrappers='#kt_app_sidebar_menu'
//         data-kt-scroll-offset='5px'
//         data-kt-scroll-save-state='true'
//       >
//         <div
//           className='menu menu-column menu-rounded menu-sub-indention px-3'
//           id='kt_app_sidebar_menu'
//           data-kt-menu='true'
//           data-kt-menu-expand='false'
//         >
//           <h4 style={{ color: '#000000' }}>Mixed Color: {mixedColor}</h4>
//           <SidebarMenuMain />
//         </div>
//       </div>
//     </div>
//   );
// };

// export { SidebarMenu };