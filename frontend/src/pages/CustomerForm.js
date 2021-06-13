import {useEffect, useState} from "react";
import {Button, Form, Input, message} from "antd";
import { cpf } from 'cpf-cnpj-validator';

import {customersService} from "../services/customersService";
import MaskedInput from "antd-mask-input";

export function CustomerForm({ customer, onSave }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer === null) {
      form.resetFields();
      return
    }

    form.setFieldsValue({ ...customer });
  }, [customer, form])

  async function onFinish(values) {
    setSaving(true);

    if (customer)
      await updateCustomer(values);
    else
      await createCustomer(values);

    setSaving(false);

    onSave()
  }

  async function createCustomer(values) {
    try {
      await customersService().create(values);
      message.success("Cliente criado com sucesso")
    } catch {
      message.error("Falha ao criar cliente");
    }
  }

  async function updateCustomer(values) {
    try {
      const mergedCustomer = { ...customer, ...values };
      await customersService().update(mergedCustomer);
      message.success("Cliente atualizado com sucesso")
    } catch {
      message.error("Falha ao atualizar cliente");
    }
  }

  return (
    <Form name="user-form" form={form} onFinish={onFinish}>
      <Form.Item
        label="Nome"
        name="name"
        rules={[{ required: true, message: 'Nome é obrigatório' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="CPF"
        name="cpf"
        rules={[
          { required: true, message: 'CPF é obrigatório' },
          { validator: (_, value, cb) => cpf.isValid(value) ? cb() : cb('CPF inválido') }
        ]}
      >
        <MaskedInput mask={"11111111111"} />
      </Form.Item>
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
        rules={[{ required: true, message: 'Placa é obrigatória' }]}
      >
        <MaskedInput mask={"AAA-1111"} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>Salvar</Button>
      </Form.Item>
    </Form>
  )
}