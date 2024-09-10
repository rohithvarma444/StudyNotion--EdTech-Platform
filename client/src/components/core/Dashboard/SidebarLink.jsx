import React from 'react';
import * as Icons from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';

function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]; // Get the correct icon from react-icons
  const location = useLocation();
  const dispatch = useDispatch();

  // Matching route function
  const matchRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <NavLink
      to={link.path}
      // Optional onClick handler
      onClick={() => dispatch(/* some action */)}
      className={`${matchRoute(link.path) ? 'bg-yellow-800' : 'bg-opacity-0'}`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
          matchRoute(link.path) ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
      <div className='flex items-center gap-x-2'>
        <Icon className="text-lg"/>
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
}

export default SidebarLink;
