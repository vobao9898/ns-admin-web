const ColumnBooking = () => {
  let am = ['12:00 AM', '12:30 AM'];
  let pm = ['12:00 PM', '12:30 PM'];
  for (let i = 1; i < 12; i++) {
    if (i < 10) i = '0' + i;
    am = [...am, `${i}:00 AM`, `${i}:30 AM`];
    pm = [...pm, `${i}:00 PM`, `${i}:30 PM`];
  }
  const times = [...am, ...pm].map((item) => ({ label: item, value: item }));
  return [
    {
      title: 'Monday',
      name: ['Monday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Open',
      name: ['Monday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Close',
      name: ['Monday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },

    {
      title: 'Tuesday',
      name: ['Tuesday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Open',
      name: ['Tuesday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Close',
      name: ['Tuesday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Wednesday',
      name: ['Wednesday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Open',
      name: ['Wednesday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Close',
      name: ['Wednesday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },

    {
      title: 'Thursday',
      name: ['Thursday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Open',
      name: ['Thursday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Close',
      name: ['Thursday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },

    {
      title: 'Friday',
      name: ['Friday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Open',
      name: ['Friday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Close',
      name: ['Friday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },

    {
      title: 'Saturday',
      name: ['Saturday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Open',
      name: ['Saturday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Close',
      name: ['Saturday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },

    {
      title: 'Sunday',
      name: ['Sunday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Open',
      name: ['Sunday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
    {
      title: 'Close',
      name: ['Sunday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
      },
    },
  ];
};

export default ColumnBooking;
