import React, { Fragment, useEffect, useState } from 'react';
import { MerchantService } from 'services/merchant';
import { Form, Select } from 'antd';
import { Button } from 'layouts/components';
import { Message } from 'components';

const Page = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  let [listData, setListData] = useState([]);

  useEffect(async () => {
    const { data } = await MerchantService.getDevice(id);
    setListData(data);
  }, []);

  const handleChangeTerminal = (e, id) => {
    listData = listData.map((i) => {
      if (i.terminalId === e && e !== 'SUPPORT ONLY') i.terminalId = '';
      else if (i.id === id) i.terminalId = e;
      return i;
    });
    setListData(listData);
  };

  const handleSaveDevice = async (e, id) => {
    setIsLoading(true);
    let flag = true;
    listData.map((i) => {
      if (!i?.terminalId) flag = false;
      return i;
    });

    if (flag) {
      await MerchantService.putDevice(e, id);
      const { data } = await MerchantService.getDevice(id);
      setListData(data);
    } else Message.error({ text: 'Please choose terminal for all devices!' });

    setIsLoading(false);
  };

  const listTerminal = [
    { value: 'SUPPORT ONLY', label: 'SUPPORT ONLY' },
    { value: 'Terminal 1 (MAIN)', label: 'Terminal 1 (MAIN)' },
  ];

  if (listTerminal.length === 2) {
    let i = 2;
    while (i <= 30) {
      listTerminal.push({ value: 'Terminal ' + i, label: 'Terminal ' + i });
      i++;
    }
  }

  return (
    <Fragment>
      <div className="font-bold text-lg mb-4 text-blue-500">Devices</div>
      {listData &&
        listData?.map((item, index) => (
          <div key={index} className="w-full rounded-xl px-3 py-2 shadow-sm mb-3 border border-gray-100">
            <div className="mb-3 text-gray-400">Device</div>
            <div className=" mb-3 cursor-pointer flex justify-between">
              <h3 className="text-sm w-3/4">{item?.deviceId}</h3>
              <Form.Item
                label="Terminal"
                validateStatus={item?.terminalId ? false : 'error'}
                help={item?.terminalId ? false : 'Choose terminal for device!'}
                hasFeedback
                className="flex items-center w-1/4"
              >
                <Select value={item?.terminalId} onChange={(e) => handleChangeTerminal(e, item?.id)} className="mt-6">
                  {listTerminal.map((terminal, inx) => (
                    <Select.Option value={terminal?.value} key={inx}>
                      {terminal?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        ))}
      {!isLoading && <Button name="Save" onClick={() => handleSaveDevice(listData, id)} />}
    </Fragment>
  );
};
export default Page;
