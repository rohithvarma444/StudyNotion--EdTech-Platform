import React from 'react';
import * as Icons from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';

function SidebarLink({ link, iconName }) {
  console.log(iconName);
  const Icon = Icons[iconName]; 
  const location = useLocation();
  const dispatch = useDispatch();

  // Check if the icon exists in react-icons
  const RenderedIcon = Icon ? <Icon className="text-lg" /> : null;

  // Matching route function
  const matchRoute = (route) => location.pathname === route;

  return (
    <NavLink
      to={link.path}
      // Optional onClick handler (implement if required)
      onClick={() => dispatch(/* some action, if required */)}
      className={`${matchRoute(link.path) ? 'bg-yellow-800' : 'bg-opacity-0'}`}
    >
      {/* Left side indicator */}
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
          matchRoute(link.path) ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>

      {/* Display icon and link name */}
      <div className='flex items-center gap-x-2'>
        {RenderedIcon}
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
}

export default SidebarLink;
