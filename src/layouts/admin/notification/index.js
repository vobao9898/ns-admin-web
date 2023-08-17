import React, { useCallback, useState } from 'react';
import { Dropdown } from 'antd';
import avatar from 'assets/images/avatar.jpeg';
import DeleteIcon from 'assets/svg/remove';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { useAuth } from 'globalContext';
import NotificationServices from 'services/notifications';

const Notification = () => {
  const navigate = useNavigate();
  const { notificationGlobals, getNotificationsGlobals } = useAuth();
  const [notifications, setNotifications] = useState({
    data: notificationGlobals?.data,
    count: notificationGlobals?.count,
  });

  const getNotifications = useCallback(async () => {
    const data = await NotificationServices.getNotifications({ page: '1', row: '10' });
    setNotifications({ data: data?.data, count: data?.count });
  }, []);

  const handleClickNotification = async (notification) => {
    await NotificationServices.deleteNotification(notification?.waNotificationId);
    await getNotificationsGlobals();
    navigate(routerLinks('Pending Request') + '/' + notification?.senderId);
  };

  const handleDelete = async (notification) => {
    await NotificationServices.deleteNotification(notification?.waNotificationId);
    const newNotis =
      notifications && notifications?.data?.filter((item) => item?.waNotificationId !== notification?.waNotificationId);
    if (newNotis?.length <= 5) {
      await getNotifications();
    } else setNotifications({ data: newNotis, count: notifications?.count - 1 });
  };

  return (
    <Dropdown
      trigger={['hover', 'click']}
      overlay={
        <div className="w-[340px] h-[400px] overflow-y-scroll bg-white p-2 shadow-md border-black/10 border rounded-md">
          <h4 className="font-semibold text-xl py-2 pl-2 border-b">Notifications</h4>
          <ul className="">
            {notifications &&
              notifications?.data?.map((item, index) => (
                <li className="border-b-2 py-2" key={index}>
                  <div className="flex items-center p-2">
                    <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-40px] rounded-full overflow-hidden mr-4">
                      <img className="w-full object-cover" src={avatar} alt="notification" />
                    </div>
                    <div className="cursor-pointer" onClick={() => handleClickNotification(item)}>
                      <p className="font-medium text-xs mb-1">{item?.content}</p>
                      <p className="text-xs">{moment(item?.createdDate + 'Z').format('MM-DD-YYYY hh:mm A')}</p>
                    </div>
                    <div className="w-fit ml-auto text-xl cursor-pointer" onClick={() => handleDelete(item)}>
                      <DeleteIcon />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      }
      placement="bottomRight"
    >
      <div className="mr-5 relative flex group cursor-pointer">
        <div className="text-white rounded p-0.5 bg-blue-400 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
          {notifications?.count}
        </div>
        <i className="las la-bell text-4xl text-gray-500" />
      </div>
    </Dropdown>
  );
};

export default Notification;
