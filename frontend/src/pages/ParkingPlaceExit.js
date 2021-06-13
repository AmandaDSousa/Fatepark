import {useEffect, useState} from "react";
import {Button, message, Space, Typography} from "antd";
import moment from "moment";

import {ParkingType} from "../enums/parking-type";
import {parkingPlacesService} from "../services/parkingPlacesService";
import {formatToBrazilianCurrency} from "../utils/currency-utils";
import {paymentsService} from "../services/paymentsService";

export function ParkingPlaceExit({parkingPlace , onFinish}) {
  const [saving, setSaving] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);
  const isAvulso = parkingPlace?.type === ParkingType.Avulso

  useEffect(() => {
    if (!isAvulso)
      getCustomerLastPayment()
  }, [])

  async function getCustomerLastPayment() {
    try {
      const lastPayment = await paymentsService().getCustomerLast(parkingPlace.customer?.id)
      setLastPayment(lastPayment)
    } catch {
      message.error("Falha ao obter dados de assinatura do cliente")
    }
  }

  async function exit() {
    try {
      setSaving(true);

      const exitingParkingPlace = {
        ...parkingPlace,
        partnerId: parkingPlace.partner?.id ?? null,
        customerId: parkingPlace.customer?.id ?? null,
        isOccupied: false
      };

      await parkingPlacesService().update(exitingParkingPlace)

      message.success("Saída realizada sucesso")

      onFinish()
    } catch {
      message.error("Falha ao realizar saída");
    } finally {
      setSaving(false);
    }
  }

  const start = moment(parkingPlace?.entranceTime)
  const end = moment()
  const occupiedHours = Math.ceil(moment.duration(end.diff(start)).asHours())
  const discount = parkingPlace?.partner?.discount ?? 0
  const subTotal = occupiedHours * 10
  const total = subTotal - discount

  return (
    <div>
      {isAvulso ? (
        <Space direction="vertical" size={36}>
          <Space direction="vertical">
            <Typography.Text>Tipo: avulso</Typography.Text>
            {parkingPlace.partner && <Typography.Text>Convênio: {parkingPlace.partner.name}</Typography.Text>}
          </Space>

          <Space direction="vertical">
            <Typography.Text>Horário de entrada: {start.format("HH:mm")}</Typography.Text>
            <Typography.Text>Horário de saída: {end.format("HH:mm")}</Typography.Text>
            <Typography.Text>Tempo de ocupação: {occupiedHours} hora{occupiedHours > 1 && "s"}</Typography.Text>
          </Space>

          <Space direction="vertical">
            <Typography.Text>Valor/hora: {formatToBrazilianCurrency(subTotal)}</Typography.Text>
            <Typography.Text>Subtotal: {formatToBrazilianCurrency(subTotal)}</Typography.Text>
            <Typography.Text>Desconto convênio: {formatToBrazilianCurrency(discount)}</Typography.Text>
            <Typography.Text strong={true}>Total: {formatToBrazilianCurrency(total)}</Typography.Text>
          </Space>

          <Button type="primary" onClick={() => exit()} loading={saving}>Dar saída</Button>
        </Space>
      ) : (
        <Space direction="vertical" size={36}>
          <Space direction="vertical">
            <Typography.Text>Tipo: mensalista</Typography.Text>
          </Space>

          <Space direction="vertical">
            <Typography.Text>Horário de entrada: {start.format("HH:mm")}</Typography.Text>
            <Typography.Text>Horário de saída: {end.format("HH:mm")}</Typography.Text>
            <Typography.Text>Tempo de ocupação: {occupiedHours} hora{occupiedHours > 1 && "s"}</Typography.Text>
          </Space>

          {lastPayment && (
            <Space direction="vertical">
              <Typography.Text>Data de início da assinatura: {moment(lastPayment?.start).format("DD/MM/YYYY")}</Typography.Text>
              <Typography.Text>Data de fim da assinatura: {moment(lastPayment?.end).format("DD/MM/YYYY")}</Typography.Text>
            </Space>
          )}

          <Button type="primary" onClick={() => exit()} loading={saving}>Dar saída</Button>
        </Space>
      )}
    </div>
  )
}