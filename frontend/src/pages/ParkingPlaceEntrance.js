import {useEffect, useState} from "react";
import {Button, Form, Input, message, Radio, Select, Space, Typography} from "antd";
import MaskedInput from 'antd-mask-input'
import {ParkingType} from "../enums/parking-type";
import {parkingPlacesService} from "../services/parkingPlacesService";
import {customersService} from "../services/customersService";

const options = [
  { label: 'Avulso', value: ParkingType.Avulso  },
  { label: 'Assinante', value: ParkingType.Assinante },
];

export function ParkingPlaceEntrance({ parkingPlace, onFinish }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState(ParkingType.Avulso);
  const [customers, setCustomers] = useState([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);

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

  async function searchCustomerWithCpf(cpf) {
    try {
      setSearchingCustomers(true)
      const customers = await customersService().getAllWithCpf(cpf)
      setCustomers(customers)
    } catch {
      message.error("Falha ao obter lista de clientes")
    } finally {
      setSearchingCustomers(true)
    }
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

  async function onFinishAssinante(values) {
    try {
      setSaving(true);

      const mergedParkingPlace = {
        ...parkingPlace,
        ...values,
        type: ParkingType.Assinante,
        vehicle: null,
        vehiclePlate: null,
        isOccupied: true
      };

      await parkingPlacesService().update(mergedParkingPlace)

      message.success("Entrada realizada sucesso")

      onFinish()
    } catch(e) {
      message.error(e.response?.data?.message ?? "Falha ao realizar entrada");
    } finally {
      setSaving(false);
    }
  }

  const isAvulso = type === ParkingType.Avulso

  const customersOptions = customers.map(customer => <Select.Option key={customer.id} value={customer.id}>{customer.name} - {customer.cpf}</Select.Option>);

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

        {isAvulso ? (
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
        ) : (
          <Form form={form} onFinish={onFinishAssinante}>
            <Form.Item
              label="Nome"
              name="customerId"
              rules={[{required: true, message: 'Cliente é obrigatório'}]}
            >
              <Select
                showSearch
                placeholder={"Buscar cliente pelo CPF"}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                loading={searchingCustomers}
                onSearch={searchCustomerWithCpf}
                notFoundContent={null}
              >
                {customersOptions}
              </Select>
            </Form.Item>

            <Typography.Text>
              *Clientes que não estão com nenhuma mensalidade em dia, não são listados!
            </Typography.Text>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving}>Dar entrada</Button>
            </Form.Item>
          </Form>
        )}
      </Space>
    </div>
  )
}