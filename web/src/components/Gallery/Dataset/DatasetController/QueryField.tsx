/**
 * Created by Jacob Xie on 11/24/2020
 */

import React, {useState} from 'react'
import {Button, Input, Space, Tooltip} from "antd"
import {CaretRightOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons"
import {FormattedMessage} from "umi"

import {EditorButton} from "@/components/Editor"

export const QueryViewer = (props: { onClick: (value: boolean) => void }) =>
  <EditorButton
    icons={{open: <PlusOutlined/>, close: <MinusOutlined/>}}
    name={{open: "Execution", close: "Close"}}
    size="small"
    onChange={props.onClick}
  />

interface QueryFieldProps {
  queryVisible: boolean
  onExecute: (sql: string) => void
}

export const QueryField = (props: QueryFieldProps) => {
  const [sqlStr, setSqlStr] = useState<string>()

  const onExecute = () => {
    if (sqlStr) props.onExecute(sqlStr)
  }

  return props.queryVisible ?
    <Space direction="vertical" style={{width: "100%"}}>
      <Input.TextArea
        rows={5}
        allowClear
        onChange={e => setSqlStr(e.target.value)}
      />
      <Tooltip title="Execute">
        <Button
          type="primary"
          size="small"
          icon={<CaretRightOutlined/>}
          onClick={onExecute}
        >
          <FormattedMessage id="gallery.component.general28"/>
        </Button>
      </Tooltip>
    </Space> : <></>
}

