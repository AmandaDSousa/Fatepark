import {useState} from "react";
import {Button, message, Space, Typography} from "antd";
import moment from "moment";

import {ParkingType} from "../enums/parking-type";
import {parkingPlacesService} from "../services/parkingPlacesService";
import {formatToBrazilianCurrency} from "../utils/currency-utils";

export function ParkingPlaceExit({parkingPlace , onFinish}) {
  const [saving, setSaving] = useState(false);

  async function exitAvulso() {
    try {
      setSaving(true);

      const exitingParkingPlace = {
        ...parkingPlace,
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

  const isAvulso = parkingPlace?.type === ParkingType.Avulso
  const start = moment(parkingPlace?.entranceTime)
  const end = moment()
  const occupiedHours = Math.ceil(moment.duration(end.diff(start)).asHours())
  const subTotal = occupiedHours * 10

  return (
    <div>
      {isAvulso && (
        <Space direction="vertical" size={36}>
          <Space direction="vertical">
            <Typography.Text>Tipo: avulso</Typography.Text>
          </Space>

          <Space direction="vertical">
            <Typography.Text>Horário de entrada: {start.format("HH:mm")}</Typography.Text>
            <Typography.Text>Horário de saída: {end.format("HH:mm")}</Typography.Text>
            <Typography.Text>Tempo de ocupação: {occupiedHours} hora{occupiedHours > 1 && "s"}</Typography.Text>
          </Space>

          <Space direction="vertical">
            <Typography.Text>Valor/hora: {formatToBrazilianCurrency(subTotal)}</Typography.Text>
            <Typography.Text>Subtotal: {formatToBrazilianCurrency(subTotal)}</Typography.Text>
            <Typography.Text>Desconto convênio: R$ 0,00</Typography.Text>
            <Typography.Text strong={true}>Total: {formatToBrazilianCurrency(subTotal)}</Typography.Text>
          </Space>

          <Button type="primary" onClick={() => exitAvulso()} loading={saving}>Dar saída</Button>
        </Space>
      )}
    </div>
  )
}