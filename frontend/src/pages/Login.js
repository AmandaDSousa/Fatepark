import {useLocation, useHistory} from "react-router-dom";
import {Button, Form, Input, Typography, message} from "antd";

import {useAuth} from "../hooks/useAuth";
import {authService} from "../services/authService";

export function Login() {
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();

  const { from } = location.state || { from: { pathname: "/" } };

  async function onFinish(values) {
    try {
      const token = await authService().login(values);

      auth.login(token, () => history.replace(from));
    } catch {
      message.error("Falha ao realizar login");
    }
  }

  return (
    <div>
      <Typography.Title>Fatepark</Typography.Title>

      <Form name="login" onFinish={onFinish}>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: 'E-mail é obrigatório' }, { type: "email", message: "E-mail inválido" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Senha é obrigatória' }, { min: 5, message: "A senha deve conter no mínimo 5 caracteres" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Entrar</Button>
        </Form.Item>
      </Form>
    </div>
  )
}