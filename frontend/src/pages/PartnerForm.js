import {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber, message} from "antd";

import {partnersService} from "../services/partnersService";

export function PartnerForm({ partner, onSave }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (partner === null) {
      form.resetFields();
      return
    }

    form.setFieldsValue({ ...partner });
  }, [partner, form])

  async function onFinish(values) {
    setSaving(true);

    if (partner)
      await updatePartner(values);
    else
      await createPartner(values);

    setSaving(false);

    onSave()
  }

  async function createPartner(values) {
    try {
      await partnersService().create(values);
      message.success("Convênio criado com sucesso")
    } catch {
      message.error("Falha ao criar convênio");
    }
  }

  async function updatePartner(values) {
    try {
      const mergedUser = { ...partner, ...values };
      await partnersService().update(mergedUser);
      message.success("Convênio atualizado com sucesso")
    } catch {
      message.error("Falha ao atualizar convênio");
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
        label="Desconto"
        name="discount"
        rules={[{ required: true, message: 'Desconto é obrigatório' }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>Salvar</Button>
      </Form.Item>
    </Form>
  )
}