import {
  AccountBookOutlined,
  AimOutlined,
  AlertOutlined,
  ApartmentOutlined,
  ApiOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  AuditOutlined,
  BankOutlined,
  BarcodeOutlined,
  BarsOutlined,
  BellOutlined,
  BlockOutlined,
  BookOutlined,
  BorderOutlined,
  BorderlessTableOutlined,
  BranchesOutlined,
  BugOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CameraOutlined,
  CarOutlined,
  CarryOutOutlined,
  CiCircleOutlined,
  CiOutlined,
  ClearOutlined,
  CloudDownloadOutlined,
  CloudOutlined,
  CloudServerOutlined,
  CloudSyncOutlined,
  CloudUploadOutlined,
  ClusterOutlined,
  CodeOutlined,
  CoffeeOutlined,
  CommentOutlined,
  CompassOutlined,
  CompressOutlined,
  ConsoleSqlOutlined,
  ContactsOutlined,
  ContainerOutlined,
  ControlOutlined,
  CopyrightOutlined,
  CreditCardOutlined,
  CrownOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeleteColumnOutlined,
  DeleteRowOutlined,
  DeliveredProcedureOutlined,
  DeploymentUnitOutlined,
  DesktopOutlined,
  DisconnectOutlined,
  DislikeOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  EllipsisOutlined,
  EuroCircleOutlined,
  ExceptionOutlined,
  ExpandAltOutlined,
  ExpandOutlined,
  ExperimentOutlined,
  FieldTimeOutlined,
  ExportOutlined,
  FileProtectOutlined,
  FileSyncOutlined,
  FileTextOutlined,
  FlagOutlined,
  ForkOutlined,
  FormatPainterOutlined,
  FundProjectionScreenOutlined,
  FundViewOutlined,
  WomanOutlined,
  WhatsAppOutlined,
  UserOutlined,
  TransactionOutlined,
  ReconciliationOutlined,
  PullRequestOutlined,
  MergeCellsOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import React, { useState, useEffect } from 'react';

export default function icons(props) {
  const list = [
    AccountBookOutlined,
    AimOutlined,
    AlertOutlined,
    ApartmentOutlined,
    ApiOutlined,
    AppstoreAddOutlined,
    AppstoreOutlined,
    AudioOutlined,
    AudioMutedOutlined,
    AuditOutlined,
    BankOutlined,
    BarcodeOutlined,
    BarsOutlined,
    BellOutlined,
    BlockOutlined,
    BookOutlined,
    BorderOutlined,
    BorderlessTableOutlined,
    BranchesOutlined,
    BugOutlined,
    BulbOutlined,
    CalculatorOutlined,
    CalendarOutlined,
    CameraOutlined,
    CarOutlined,
    CarryOutOutlined,
    CiCircleOutlined,
    ClearOutlined,
    CloudDownloadOutlined,
    CloudOutlined,
    CloudServerOutlined,
    CloudSyncOutlined,
    CloudUploadOutlined,
    ClusterOutlined,
    CodeOutlined,
    CoffeeOutlined,
    CommentOutlined,
    CompassOutlined,
    CompressOutlined,
    ConsoleSqlOutlined,
    ContactsOutlined,
    ContainerOutlined,
    ControlOutlined,
    CopyrightOutlined,
    CreditCardOutlined,
    CrownOutlined,
    CustomerServiceOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    DeleteColumnOutlined,
    DeleteRowOutlined,
    DeliveredProcedureOutlined,
    DeploymentUnitOutlined,
    DesktopOutlined,
    DisconnectOutlined,
    DislikeOutlined,
    DollarCircleOutlined,
    DownloadOutlined,
    EnvironmentOutlined,
    EllipsisOutlined,
    EuroCircleOutlined,
    ExceptionOutlined,
    ExpandAltOutlined,
    ExpandOutlined,
    ExperimentOutlined,
    FieldTimeOutlined,
    ExportOutlined,
    FileProtectOutlined,
    FileSyncOutlined,
    FileTextOutlined,
    FlagOutlined,
    ForkOutlined,
    FormatPainterOutlined,
    FundProjectionScreenOutlined,
    FundViewOutlined,
    WomanOutlined,
    WhatsAppOutlined,
    UserOutlined,
    TransactionOutlined,
    ReconciliationOutlined,
    PullRequestOutlined,
    MergeCellsOutlined,
    HomeOutlined,
  ];

  const [activeIndex, setActiveIndex] = useState(-1);

  const clickHandler = (e, i) => {
    // 选中icon
    if (activeIndex === -1) {
      setActiveIndex(i);
    } else {
      setActiveIndex(-1);
    }
    props.setIconSelect(e);
    props.setIconIndex(i);
  };

  useEffect(() => {
    setActiveIndex(props.iconIndex); // 回显时激活显示icon
  }, [props.iconIndex]);

  return (
    <div className="config-panel__icons">
      <Space size={[8, 16]} wrap>
        {list.map((item, index) => (
          <div
            key={index}
            onClick={() => clickHandler(React.createElement(item), index)}
            className={activeIndex === index ? 'icons-box active' : 'icons-box'}
          >
            {React.createElement(item)}
          </div>
        ))}
      </Space>
    </div>
  );
}
