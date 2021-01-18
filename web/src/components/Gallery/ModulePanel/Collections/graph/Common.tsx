/**
 * Created by Jacob Xie on 10/19/2020.
 */

import React, {useEffect, useState} from 'react'
import {Button, message, Modal, Space} from "antd"
import {StepsForm} from "@ant-design/pro-form"
import {CheckCircleTwoTone, CloseCircleTwoTone} from "@ant-design/icons"
import ReactEcharts from "echarts-for-react"
import {EChartOption} from "echarts"
import _ from "lodash"

import {QuerySelectorModal} from "@/components/Gallery/Dataset"

import {ModuleEditorField, ModulePresenterField} from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import {ChartConfig} from "./data"
import {AxisSelectorForm} from "./AxisSelectorForm"


export const generateCommonEditorField = (mixin: boolean = false) =>
  (props: ModuleEditorField) => {
    const [visible, setVisible] = useState(false)
    const [content, setContent] = useState<DataType.Content | undefined>(props.content)
    const [dataAvailable, setDataAvailable] = useState(false)
    const [columns, setColumns] = useState<string[]>()

    const saveContentData = (data: Record<string, any>) => {
      const ctt = {
        ...content!,
        date: DataType.today(),
        data
      }
      setContent(ctt)
      setColumns(data.selects)
      setDataAvailable(true)

      return true
    }


    const saveContent = async (values: Record<string, any>) => {
      if (content) {
        const v = values as ChartConfig

        let config
        const ys = _.difference(columns, [v.x.column])

        if (v.y) {
          const yColNames = _.reduce(v.y, (acc: string[], i) =>
            ([...acc, ...i.columns]), [])
          const baseY = [{position: "left", columns: _.difference(ys, yColNames)}]
          config = {...v, y: [...baseY, ...v.y]}
        } else
          config = {...v, y: [{position: "left", columns: ys}]}

        const ctt = {...content, config}
        props.updateContent(ctt)
        message.success("Updating succeeded!")
      } else {
        message.warn("Updating failed! dataset and options are required!")
      }
      setVisible(false)
    }

    const dataSelectOnFinish = async () => {
      if (content?.data === undefined || content?.data.length === 0) {
        message.warn("Please choose your data!")
        return false
      }
      return true
    }

    return (
      <div className={props.styling}>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
        >
          Modify
        </Button>

        <StepsForm
          onFinish={saveContent}
          stepsFormRender={(dom, submitter) =>
            <Modal
              title="Setup process"
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={submitter}
              destroyOnClose
              width="40vw"
            >
              {dom}
            </Modal>
          }
        >
          <StepsForm.StepForm
            name="data"
            title="Data"
            onFinish={dataSelectOnFinish}
          >
            <Space>
              <QuerySelectorModal
                trigger={
                  <Button
                    type='primary'
                    style={{marginBottom: 20}}
                  >
                    Click to select a dataset
                  </Button>
                }
                storagesOnFetch={props.fetchStorages!}
                storageOnSelect={props.fetchTableList!}
                tableOnSelect={props.fetchTableColumns!}
                onSubmit={saveContentData}
                columnsRequired
              />
              {
                dataAvailable ?
                  <CheckCircleTwoTone twoToneColor="green"/> :
                  <CloseCircleTwoTone twoToneColor="red"/>
              }
            </Space>
          </StepsForm.StepForm>

          <StepsForm.StepForm
            name="config"
            title="Configuration"
            initialValues={{x: {type: "category"}}}
          >
            <AxisSelectorForm
              mixin={mixin}
              columns={columns}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    )
  }

export const generateCommonPresenterField =
  (chartOptionGenerator: (data: any[], config: ChartConfig) => EChartOption) =>
    (props: ModulePresenterField) => {

      const [data, setData] = useState<any[]>()

      useEffect(() => {
        if (props.fetchQueryData && props.content) {
          if (props.content.data)
            props.fetchQueryData(props.content).then(res => setData(res))
        }
      }, [props.content])


      if (data && props.content && props.content.config)
        return <ReactEcharts
          option={chartOptionGenerator(data, props.content.config as ChartConfig)}
          style={{height: props.contentHeight}}
        />
      return <></>
    }

