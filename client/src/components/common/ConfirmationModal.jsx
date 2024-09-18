import React from 'react';
import * as Icons from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';

function SidebarLink({ link, iconName }) {
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
      onClick={() => dispatch(/* some action, if required */)}
      className={`relative flex items-center gap-x-3 px-4 py-3 rounded-md transition-all duration-200 
        ${matchRoute(link.path) ? 'bg-richblack-700 text-yellow-300' : 'text-richblack-300'}
        hover:bg-richblack-700 hover:text-yellow-300`}
    >
      {/* Left side indicator */}
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-300 transition-opacity duration-300
          ${matchRoute(link.path) ? 'opacity-100' : 'opacity-0'}`}
      ></span>

      {/* Display icon and link name */}
      <div className='flex items-center gap-x-3'>
        {RenderedIcon}
        <span className="text-sm font-medium">{link.name}</span>
      </div>
    </NavLink>
  );
}

export default SidebarLink;
