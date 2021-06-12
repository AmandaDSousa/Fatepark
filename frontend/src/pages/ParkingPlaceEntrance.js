import {useEffect, useState} from "react";
import {Button, Form, Input, message, Radio, Space} from "antd";
import MaskedInput from 'antd-mask-input'
import {ParkingType} from "../enums/parking-type";
import {parkingPlacesService} from "../services/parkingPlacesService";

const options = [
  { label: 'Avulso', value: ParkingType.Avulso  },
  { label: 'Assinante', value: ParkingType.Assinante },
];

export function ParkingPlaceEntrance({ parkingPlace, onFinish }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState(ParkingType.Avulso);

  useEffect(() => {
    if (parkingPlace === null) {
      form.resetFields();
      return
    }

    form.setFieldsValue({ ...parkingPlace });
  }, [parkingPlace, form])

  function onChange(event) {
    setType(event.target.value)
  }

  async function onFinishAvulso(values) {
    try {
      setSaving(true);

      const mergedParkingPlace = {
        ...parkingPlace,
        ...values,
        type: ParkingType.Avulso,
        customerId: null,
        isOccupied: true
      };

      await parkingPlacesService().update(mergedParkingPlace)

      message.success("Entrada realizada sucesso")

      onFinish()
    } catch {
      message.error("Falha ao realizar entrada");
    } finally {
      setSaving(false);
    }
  }

  const isAvulso = type === ParkingType.Avulso

  return (
    <div>
      <Space direction="vertical" size={32}>
        <Radio.Group
          options={options}
          onChange={onChange}
          value={type}
          optionType="button"
          buttonStyle="solid"
        />

        {isAvulso && (
          <Form form={form} onFinish={onFinishAvulso}>
            <Form.Item
              label="Veículo"
              name="vehicle"
              rules={[{ required: true, message: 'Veículo é obrigatório' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Placa"
              name="vehiclePlate"
              rules={[{ required: true, message: 'Placa é obrigatório' }]}
            >
              <MaskedInput mask="AAA-1111" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving}>Dar entrada</Button>
            </Form.Item>
          </Form>
        )}
      </Space>
    </div>
  )
}