import { OverlayTrigger } from 'react-bootstrap'

export function Tooltip({ tooltipitem, children, placement = 'top' }) {
  return (
    <OverlayTrigger placement={placement} overlay={tooltipitem}>
      {children}
    </OverlayTrigger>
  )
}