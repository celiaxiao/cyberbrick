/**
 * Created by Jacob Xie on 10/29/2020.
 */

import React from 'react'
import { Button, Input, InputNumber, Select, Space } from "antd"
import { CheckCircleTwoTone, CloseCircleTwoTone, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'


interface EditFieldProps<T extends string | number> {
  editable: boolean
  placeholder?: string
  selections?: string[]
  defaultValue?: T
  onChange: (value: T) => void
}

interface StateFieldProps {
  state: boolean
}

interface OperationFieldProps {
  editable: boolean
  onUpdateClick: () => void
  onDeleteClick: () => void
  onCheckClick: () => void
  disabled: boolean
}

export const StringField = (props: EditFieldProps<string>) =>
  props.editable ?
    <Input
      size="small"
      style={ { width: 150 } }
      placeholder={ props.placeholder }
      defaultValue={ props.defaultValue }
      onChange={ e => props.onChange(e.target.value) }
    /> :
    <span>{ props.defaultValue }</span>

export const NumberField = (props: EditFieldProps<number>) =>
  props.editable ?
    <InputNumber
      size="small"
      style={ { width: 150 } }
      placeholder={ props.placeholder }
      defaultValue={ props.defaultValue }
      onChange={ v => props.onChange(+v!) }
      precision={ 0 }
    /> :
    <span>{ props.defaultValue }</span>

export const SelectionField = (props: EditFieldProps<string>) =>
  props.editable ?
    <Select
      size="small"
      style={ { width: 150 } }
      defaultValue={ props.defaultValue }
      onChange={ e => props.onChange(e.toString()) }
    >
      {
        props.selections!.map((s, idx) =>
          <Select.Option value={ s } key={ idx }>{ s }</Select.Option>
        )
      }
    </Select> :
    <span>{ props.defaultValue }</span>

export const StateField = (props: StateFieldProps) =>
  props.state ?
    <CheckCircleTwoTone twoToneColor="green"/> :
    <CloseCircleTwoTone twoToneColor="red"/>

export const PasswordField = (props: EditFieldProps<string>) =>
  props.editable ?
    <Input.Password
      size="small"
      style={ { width: 150 } }
      placeholder="password"
      defaultValue={ props.defaultValue }
      iconRender={ visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>) }
      onChange={ e => props.onChange(e.target.value) }
    /> :
    <span>******</span>

export const OperationField = (props: OperationFieldProps) =>
  props.editable ?
    <Space>
      <Button
        size="small"
        type="primary"
        onClick={ props.onUpdateClick }
        disabled={ props.disabled }
      >
        Update
      </Button>
      <Button
        size="small"
        danger
        onClick={ props.onDeleteClick }
        disabled={ props.disabled }
      >
        Delete
      </Button>
    </Space> :
    <Button
      size="small"
      type="primary"
      onClick={ props.onCheckClick }
    >
      Check connection
    </Button>

