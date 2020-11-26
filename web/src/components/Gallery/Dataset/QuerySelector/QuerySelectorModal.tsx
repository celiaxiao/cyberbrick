/**
 * Created by Jacob Xie on 11/26/2020
 */

import React, {useRef} from 'react'
import {ModalForm} from "@ant-design/pro-form"

import {BaseForm, BaseFormRef} from "./BaseForm"
import * as DataType from "@/components/Gallery/GalleryDataType"

export interface QuerySelectorModalProps {
  trigger: React.ReactElement
  storagesOnFetch: () => Promise<DataType.StorageSimple[]>
  storageOnSelect: (id: string) => Promise<string[]>
  tableOnSelect: (id: string, name: string) => Promise<string[]>
  onSubmit: (value: Record<string, any>) => Promise<any>
}

export const QuerySelectorModal = (props: QuerySelectorModalProps) => {
  const ref = useRef<BaseFormRef>(null)

  const onValuesChange = (value: Record<string, any>) => {
    if (ref.current) ref.current.onValuesChange(value)
  }

  return (
    <ModalForm
      title="Query Selector"
      trigger={props.trigger}
      onValuesChange={onValuesChange}
      onFinish={props.onSubmit}
      modalProps={{maskClosable: false, keyboard: false, closable: false}}
    >
      <BaseForm
        storagesOnFetch={props.storagesOnFetch}
        storageOnSelect={props.storageOnSelect}
        tableOnSelect={props.tableOnSelect}
        ref={ref}
      />
    </ModalForm>
  )
}

