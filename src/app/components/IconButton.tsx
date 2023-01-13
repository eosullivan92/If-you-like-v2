import { IconBtnProps } from '../types/types';

export function IconBtn({
  Icon,
  isActive,
  color,
  onClick,
  children,
}: IconBtnProps) {
  return (
    <button
      className={`btn icon-btn ${isActive ? 'icon-btn-active' : ''} ${
        color || ''
      }`}
      onClick={onClick}
    >
      <span className={`${children != null ? 'mr-1' : ''}`}>
        <Icon />
      </span>
      {children}
    </button>
  );
}
