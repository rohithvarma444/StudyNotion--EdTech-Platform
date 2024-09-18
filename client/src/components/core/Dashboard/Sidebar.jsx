import React, { useState } from 'react';
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from 'react-redux';
import SidebarLink from './SidebarLink';
import { useNavigate } from 'react-router-dom';
import { VscSignOut } from 'react-icons/vsc';
import ConfirmationModal from '../../common/ConfirmationModal';

function Sidebar() {
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);

  if (profileLoading || authLoading) {
    return (
      <div className='mt-10 text-center'>
        Loading...
      </div>
    );
  }

  return (
    <div className='flex flex-col min-w-[250px] border-r-[1px] border-r-richblack-700 h-[calc(100vh - 3.5rem)] bg-richblack-800 py-8 px-4 text-white'>

      {/* Sidebar Links */}
      <div className='flex flex-col space-y-4'>
        {sidebarLinks.map((link, index) => {
          if (link.type && user?.accountType !== link.type) return null;
          return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
        })}
      </div>

      {/* Divider */}
      <div className='mx-auto my-8 h-[1px] w-10/12 bg-richblack-600'></div>

      {/* Settings and Logout */}
      <div className='flex flex-col space-y-4'>
        <SidebarLink link={{ name: "Settings", path: "dashboard/settings", icon: "VscSettingsGear" }} iconName="VscSettingsGear" />

        <button
          onClick={() => setConfirmationModal({
            text1: "Are you sure?",
            text2: "You will be logged out of your Account.",
            btn1Text: "Logout",
            btn2Text: "Cancel",
            btn1Handler: () => dispatch(logout(navigate)),
            btn2Handler: () => setConfirmationModal(null),
          })}
          className='text-sm font-medium text-richblack-25 hover:bg-richblack-700 py-3 px-5 rounded-md transition-all duration-200'
        >
          <div className='flex items-center gap-x-3'>
            <VscSignOut className='text-lg' />
            <span>Logout</span>
          </div>
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

export default Sidebar;
