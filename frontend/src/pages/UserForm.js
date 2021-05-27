import {useEffect, useState} from "react";
import {Button, Form, Input, message, Select} from "antd";

import {usersService} from "../services/usersService";
import {UserTypes} from "../enums/user-types";

const { Option } = Select;

export function UserForm({ user }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user === null) {
      form.resetFields();
      return
    }

    form.setFieldsValue({ ...user });
  }, [user, form])

  async function onFinish(values) {
    setSaving(true);

    if (user)
      await updateUser(values);
    else
      await createUser(values);

    setSaving(false);
  }

  async function createUser(values) {
    try {
      await usersService().create(values);
      message.success("Usuário criado com sucesso")
    } catch {
      message.error("Falha ao criar usuário");
    }
  }

  async function updateUser(values) {
    try {
      const mergedUser = { ...user, ...values };
      await usersService().update(mergedUser);
      message.success("Usuário atualizado com sucesso")
    } catch {
      message.error("Falha ao atualizar usuário");
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
        label="E-mail"
        name="email"
        rules={[{ required: true, message: 'E-mail é obrigatório' }, { type: "email", message: "E-mail inválido" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tipo"
        name="type"
        rules={[{ required: true, message: 'Tipo é obrigatório' }]}
      >
        <Select
          placeholder="Select a option and change input text above"
          allowClear
        >
          <Option value={UserTypes.Administrativo}>Administrativo</Option>
          <Option value={UserTypes.Financeiro}>Financeiro</Option>
          <Option value={UserTypes.Operacional}>Operacional</Option>
        </Select>
      </Form.Item>
      {user === null && (
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Senha é obrigatória' }, { min: 5, message: "Senha deve conter pelo menos 5 caracteres" }]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>Salvar</Button>
      </Form.Item>
    </Form>
  )
}