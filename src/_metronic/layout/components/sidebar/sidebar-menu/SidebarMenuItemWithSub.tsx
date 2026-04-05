import React from 'react'
import clsx from 'clsx'
import { useLocation } from 'react-router'
import { checkIsActive, KTIcon, WithChildren } from '../../../../helpers'
import { useLayout } from '../../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const SidebarMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
}) => {
  const { pathname } = useLocation()
  const isActive = checkIsActive(pathname, to)
  const { config } = useLayout()
  const { app } = config

  const isImageIcon = icon?.includes('/media/') // Check if the icon is an image

  // Inline styles for the icon and link
  const menuLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
  }

  const menuIconStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20px',
    height: '20px',
    overflow: 'hidden',
  }

  const customIconStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  }

  return (
    <div
      className={clsx('menu-item', { 'here show': isActive }, 'menu-accordion')}
      data-kt-menu-trigger='click'
    >
      <span className='menu-link' style={menuLinkStyle}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}

        {icon && isImageIcon ? (
          <span style={menuIconStyle}>
            <img src={icon} alt={title} style={customIconStyle} />
          </span>
        ) : (
          <>
            {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
              <span className='menu-icon'>
                <KTIcon iconName={icon} className='fs-2' />
              </span>
            )}
            {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
              <i className={clsx('bi fs-3', fontIcon)}></i>
            )}
          </>
        )}

        <span className='menu-title'>{title}</span>
        <span className='menu-arrow'></span>
      </span>
      <div className={clsx('menu-sub menu-sub-accordion', { 'menu-active-bg': isActive })}>
        {children}
      </div>
    </div>
  )
}

export { SidebarMenuItemWithSub }







// import React from 'react'
// import clsx from 'clsx'
// import {useLocation} from 'react-router'
// import {checkIsActive, KTIcon, WithChildren} from '../../../../helpers'
// import {useLayout} from '../../../core'

// type Props = {
//   to: string
//   title: string
//   icon?: string
//   fontIcon?: string
//   hasBullet?: boolean
// }

// const SidebarMenuItemWithSub: React.FC<Props & WithChildren> = ({
//   children,
//   to,
//   title,
//   icon,
//   fontIcon,
//   hasBullet,
// }) => {
//   const {pathname} = useLocation()
//   const isActive = checkIsActive(pathname, to)
//   const {config} = useLayout()
//   const {app} = config

//   return (
//     <div
//       className={clsx('menu-item', {'here show': isActive}, 'menu-accordion')}
//       data-kt-menu-trigger='click'
//     >
//       <span className='menu-link'>
//         {hasBullet && (
//           <span className='menu-bullet'>
//             <span className='bullet bullet-dot'></span>
//           </span>
//         )}
//         {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
//           <span className='menu-icon'>
//             <KTIcon iconName={icon} className='fs-2' />
//           </span>
//         )}
//         {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
//           <i className={clsx('bi fs-3', fontIcon)}></i>
//         )}
//         <span className='menu-title'>{title}</span>
//         <span className='menu-arrow'></span>
//       </span>
//       <div className={clsx('menu-sub menu-sub-accordion', {'menu-active-bg': isActive})}>
//         {children}
//       </div>
//     </div>
//   )
// }

// export {SidebarMenuItemWithSub}
