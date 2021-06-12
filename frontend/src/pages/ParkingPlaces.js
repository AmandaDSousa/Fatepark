import {useEffect, useState} from "react";
import {Col, Drawer, message, Row, Space, Table, Typography} from "antd";
import moment from "moment";
import {parkingPlacesService} from "../services/parkingPlacesService";
import {ParkingPlaceEntrance} from "./ParkingPlaceEntrance";
import {ParkingPlaceExit} from "./ParkingPlaceExit";

const PAGE_SIZE = 10;

export function ParkingPlaces() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [parkingPlaces, setParkingPlaces] = useState([]);
  const [occupiedRelation, setOccupiedRelation] = useState({occupiedCount: 0, totalCount: 0});
  const [entranceDrawerVisible, setEntranceDrawerVisible] = useState(false);
  const [enteringParkingPlace, setEnteringParkingPlace] = useState(null);
  const [exitDrawerVisible, setExitDrawerVisible] = useState(false);
  const [exitingParkingPlace, setExitingParkingPlace] = useState(null);

  useEffect(() => {
    getParkingPlaces(currentPage)
    getOccupiedRelation()
  }, [currentPage])

  const columns = [
    {title: "ID", dataIndex: "id"},
    {
      title: "Ocupado",
      dataIndex: "isOccupied",
      render: (_, row) => row.isOccupied ? "Sim" : "Não",
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        }
      ],
      onFilter: (value, record) => record.isOccupied === value,
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      render: (_, row) => row.customer?.name
    },
    {title: "Veículo", dataIndex: "vehicle"},
    {title: "Placa", dataIndex: "vehiclePlate"},
    {
      title: "Horário Entrada",
      dataIndex: "entranceTime",
      render: (_, row) => row.entranceTime ? moment(row.entranceTime).format("HH:mm") : null
    },
    {
      title: "Ações",
      dataIndex: "",
      render: (_, record) => (
        <Space>
          {record.isOccupied ? (
            <a onClick={() => onExit(record)}>Saída</a>
          ) : (
            <a onClick={() => onEntrance(record)}>Entrada</a>
          )}
        </Space>
      )
    }
  ]

  async function getParkingPlaces(page) {
    try {
      setLoading(true)
      const {items, count} = await parkingPlacesService().getAllPaged(page, PAGE_SIZE);
      setParkingPlaces(items)
      setCount(count)
    } catch {
      message.error("Falha ao obter lista de vagas de estacionamento");
    } finally {
      setLoading(false)
    }
  }

  async function getOccupiedRelation() {
    try {
      const occupiedRelation = await parkingPlacesService().getOccupiedRelation();
      setOccupiedRelation(occupiedRelation)
    } catch {
      message.error("Falha ao obter relação de ocupação");
    }
  }

  function handleChange(pagination) {
    setPage(pagination.current);
  }

  function onEntrance(parkingPlace) {
    setEnteringParkingPlace(parkingPlace)
    setEntranceDrawerVisible(true)
  }

  async function onEntranceDrawerClose() {
    setEnteringParkingPlace(null);
    setEntranceDrawerVisible(false);
    await getParkingPlaces(currentPage);
  }

  function onExit(parkingPlace) {
    setExitingParkingPlace(parkingPlace)
    setExitDrawerVisible(true)
  }

  async function onExitDrawerClose() {
    setExitingParkingPlace(null);
    setExitDrawerVisible(false);
    await getParkingPlaces(currentPage);
  }

  const {occupiedCount, totalCount} = occupiedRelation

  return (
    <div>
      <Row align={"top"} justify={"space-between"}>
        <Col>
          <Typography.Title level={2}>Vagas</Typography.Title>
        </Col>
        <Col>
          <Space direction="vertical" size="4" style={{fontSize: 16}}>
            <Typography.Text>Ocupações</Typography.Text>
            <Typography.Text>{occupiedCount}/{totalCount}</Typography.Text>
          </Space>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        rowKey={record => record.id}
        pagination={{current: currentPage, pageSize: PAGE_SIZE, total: count}}
        dataSource={parkingPlaces}
        onChange={handleChange}
      />

      <Drawer
        width={500}
        title={"Entrada de vaga"}
        placement="right"
        onClose={onEntranceDrawerClose}
        visible={entranceDrawerVisible}
      >
        <ParkingPlaceEntrance
          parkingPlace={enteringParkingPlace}
          onFinish={onEntranceDrawerClose}
        />
      </Drawer>

      <Drawer
        width={500}
        title={"Saída de vaga"}
        placement="right"
        onClose={onExitDrawerClose}
        visible={exitDrawerVisible}
      >
        <ParkingPlaceExit
          destroyOnClose={true}
          parkingPlace={exitingParkingPlace}
          onFinish={onExitDrawerClose}
        />
      </Drawer>
    </div>
  )
}