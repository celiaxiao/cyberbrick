import { useState } from "react"
import { Checkbox, Divider, Input, List, message, Modal, Space, Tooltip } from "antd"
import { ExclamationCircleTwoTone, RightOutlined, StarTwoTone } from "@ant-design/icons"
import { FormattedMessage } from "umi"

import * as DataType from "@/components/Gallery/GalleryDataType"
import { moduleList } from "@/components/Gallery/ModulePanel/Collections"

import styles from "@/components/Gallery/Dashboard/DashboardController/Common.less"


interface ModuleSelectionListProps {
    onSelect: (value: string) => void
}

const ModuleSelectionList = (props: ModuleSelectionListProps) =>
    <>
        {moduleList.map(chunk => (
            <div key={chunk.key}>
                <Divider orientation="left">{chunk.name}</Divider>
                <List
                    grid={{ column: 6 }}
                    size="small"
                    dataSource={chunk.children}
                    renderItem={item => (
                        <List.Item>
                            <label className={styles.moduleSelectionLabel}>
                                <input type="radio" name="radio-name" disabled={item.disabled} id={item.key} />
                                <div
                                    id={item.key}
                                    onClick={() => props.onSelect(item.key)}
                                    className={item.disabled ? styles.selectionCardDisabled : styles.selectionCard}
                                >
                                    {item.name}
                                </div>
                            </label>
                        </List.Item>
                    )}
                />
            </div>
        ))}
    </>

interface ModuleSelectionViewProps {
    setName: (value: string) => void
    setTimeSeries: (value: boolean) => void
    setSelected: (value: string) => void
}

const ModuleSelectionView = (props: ModuleSelectionViewProps) =>
    <>
        <Space direction="vertical">
            <Space>
                <StarTwoTone />
                <span style={{ width: 250, fontSize: 15 }}>
                    <FormattedMessage id="gallery.component.add-module-modal4" />
                </span>
            </Space>
            <Space>
                <RightOutlined />
                <Input style={{ width: 200 }} onChange={e => props.setName(e.target.value)} />
                <Tooltip
                    title={<FormattedMessage id="gallery.component.add-module-modal3" />}
                >
                    <ExclamationCircleTwoTone twoToneColor="red" />
                </Tooltip>
            </Space>
            <Space>
                <StarTwoTone />
                <span style={{ width: 250, fontSize: 15 }}>
                    <FormattedMessage id="gallery.component.add-module-modal5" />
                </span>
            </Space>
            <Space>
                <RightOutlined />
                <Checkbox onChange={e => props.setTimeSeries(e.target.checked)}>
                    <FormattedMessage id="gallery.component.add-module-modal6" />
                </Checkbox>
            </Space>
        </Space>
        <ModuleSelectionList onSelect={props.setSelected} />
    </>


export interface AddModuleModalProps {
    onAddModule: (name: string, timeSeries: boolean, moduleType: DataType.ElementType) => void
    // categories: DataType.Category[]
    // categoryOnSelect: (categoryName: string) => Promise<DataType.Category>
    // dashboardOnSelect: (id: string) => Promise<DataType.Dashboard>
    // copyTemplate: (originTemplateId: string) => void
    visible: boolean
    onQuit: () => void
}

export const AddModuleModal = (props: AddModuleModalProps) => {

    const [selected, setSelected] = useState<string>()
    const [moduleName, setModuleName] = useState<string>()
    const [timeSeries, setTimeSeries] = useState<boolean>(false)

    const onSetOk = () => {
        if (selected && moduleName) {
            props.onQuit()
            props.onAddModule(moduleName, timeSeries, DataType.getElementType(selected))
        } else
            message.warn("Please enter your element name and select one module!")
    }

    return (
        <Modal
            title={<FormattedMessage id="gallery.component.add-module-modal1" />}
            visible={props.visible}
            onOk={onSetOk}
            onCancel={props.onQuit}
            width="60%"
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            style={{ top: 40 }}
        >
            <ModuleSelectionView
                setName={setModuleName}
                setTimeSeries={setTimeSeries}
                setSelected={setSelected}
            />
        </Modal>
    )
}
