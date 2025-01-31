/**
 * Created by Jacob Xie on 9/22/2020.
 */

import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Modal, Skeleton } from "antd"
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useIntl } from "umi"
import _, { floor } from "lodash"

import * as DataType from "../../GalleryDataType"
import { ConvertFwRef } from "../Generator/data"
import { ModulePanelHeader } from "./ModulePanelHeader"
import { ModulePanelFooter } from "./ModulePanelFooter"
import { collectionSelector } from "../Collections"
import { ModuleSelectorProps } from "../Collections/collectionSelector"

import styles from "./Common.less"
import { IsTemplateContext } from "@/pages/gallery/DashboardTemplate"
import { ModuleDescirption } from "./ModuleDescription"


export interface ModulePanelProps {
  parentInfo: string[]
  eleId: string
  headName: string
  timeSeries?: boolean
  elementType: DataType.ElementType
  description?: string
  content?: DataType.Content
  fetchStorages?: () => Promise<DataType.StorageSimple[]>
  fetchTableList?: (id: string) => Promise<string[]>
  fetchTableColumns?: (storageId: string, tableName: string) => Promise<string[]>
  fetchQueryData?: (value: DataType.Content) => Promise<any>
  contentHeight?: number
  fetchContent: (date?: string) => void
  fetchContentDates?: () => Promise<string[]>
  updateContent: (c: DataType.Content) => void
  onRemove: () => void
  editable: boolean
  settable: boolean
  isLoading: boolean

  updateDescription: (ele: string) => void
  fetchContentFn: (id: string, date?: string, isNested?: boolean) => Promise<DataType.Content | undefined>
  fetchContentDatesFn: (id: string, markName?: string) => Promise<DataType.Element>
  isNested?: boolean
}

const SKELETON_HEIGHT_TO_ROWS = 50
const SKELETON_DEFAULT_ROWS = 5

// todo: add Tags presenting
// todo: current `ModulePanel` is for `Dashboard`, need one for `Overview`
export const ModulePanel = (props: ModulePanelProps) => {
  const intl = useIntl()
  const moduleRef = useRef<React.FC<ModuleSelectorProps>>()
  const moduleFwRef = useRef<ConvertFwRef>(null)

  const [content, setContent] = useState<DataType.Content>()
  const [dates, setDates] = useState<string[]>([])

  const [loading, setIsLoading] = useState(props.isLoading)
  const isTemplate = useContext(IsTemplateContext)

  useEffect(() => {
    setIsLoading(props.isLoading)
  }, [props.isLoading])
  useEffect(() => {
    moduleRef.current = collectionSelector(props.elementType)
  }, [])

  useEffect(() => setContent(props.content), [props.content])

  //when dashboard is set to uneditable, make modulePanel unable to edit (by calling moduleFwRef.current.edit(false))
  useEffect(() => {
    if (!props.editable && moduleFwRef.current) moduleFwRef.current.edit(props.editable)
  }, [props.editable])

  useEffect(() => {
    if (props.timeSeries && props.fetchContentDates && content && !props.editable) {
      props.fetchContentDates().then(res => setDates(res))
    }
  }, [content, props.editable])


  const editContent = (value: boolean) => {
    if (props.editable && moduleFwRef.current) moduleFwRef.current.edit(value)
  }

  const confirmDelete = () =>
    Modal.confirm({
      title: intl.formatMessage({ id: "gallery.component.module-panel.panel.module-panel1" }),
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => props.onRemove()
    })

  const updateTitle = (title: string) => {
    const newContent = content ?
      { ...content, title } :
      { title, date: DataType.today() } as DataType.Content
    setContent(newContent)
    props.updateContent(newContent)
  }

  const footerDate = () => {
    if (props.timeSeries && content)
      return { date: content.date }
    return {}
  }

  const headerDate = (date: string) => {
    if (props.timeSeries) {
      const newContent = content ?
        { ...content, date } :
        { date, data: {} } as DataType.Content
      setContent(newContent)
      props.updateContent(newContent)
    }
  }

  const updateModuleContent = (ctt: DataType.Content) => {
    const newContent = { ...content, ...ctt }
    setContent(newContent)
    props.updateContent(newContent)
  }

  const newDateWithContent = (d: string) => {
    const prevContentWithoutId = _.omit(content, "id")
    const newContent = {
      ...prevContentWithoutId,
      date: d
    } as DataType.Content
    setContent(newContent)
    props.updateContent(newContent)
  }

  const genHeader = <ModulePanelHeader
    editable={props.editable}
    settable={props.settable}
    timeSeries={props.timeSeries}
    headName={props.headName}
    type={props.elementType}
    title={content ? content.title : undefined}
    updateTitle={updateTitle}
    editContent={editContent}
    newContent={newDateWithContent}
    confirmDelete={confirmDelete}
    dateList={dates}
    editDate={headerDate}
    onSelectDate={props.fetchContent}
  />

  const genDescription = useMemo(() => {
    if (isTemplate && !props.isNested) {
      if (!props.editable && !props.description) return <></>
      return <ModuleDescirption
        editable={props.editable}
        initialValue={props.description || ''}
        onSave={props.updateDescription}
      />

    }
    return <></>
  }, [props.editable, isTemplate])

  const genContext = useMemo(() => {
    // console.log(content?.data)
    const rf = moduleRef.current
    if (rf) {
      //if it's has id (so it's saved to db) and it's loading, display skeleton. 
      //If we finish loading, display whatever content is, including a white board (for content undefined or null)
      if (props.eleId && loading && !content) {
        const rows =
          props.contentHeight ? floor(props.contentHeight / SKELETON_HEIGHT_TO_ROWS) : SKELETON_DEFAULT_ROWS
        return <Skeleton className={styles.loadinSkeleton}
          active paragraph={{ rows: rows }} />
      }

      let h = props.contentHeight ? props.contentHeight - 80 : undefined
      h = isTemplate && h ? h - 60 : h
      h = props.isNested ? props.contentHeight : h
      // console.log(props.eleId, h)
      return rf({
        content,
        fetchStorages: props.fetchStorages,
        fetchTableList: props.fetchTableList,
        fetchTableColumns: props.fetchTableColumns,
        fetchQueryData: props.fetchQueryData,
        contentHeight: h,
        updateContent: updateModuleContent,
        forwardedRef: moduleFwRef,
        styling: isTemplate ? styles.templateContentPanel : styles.contentPanel,
        fetchContentFn: props.fetchContentFn,
        fetchContentDatesFn: props.fetchContentDatesFn
      })
    }
    return <></>
  }, [content, props.contentHeight, loading])

  const genFooter = useMemo(() =>
    <ModulePanelFooter
      parentInfo={props.parentInfo}
      eleId={props.eleId}
      type={props.elementType}
      id={content ? content.id : undefined}
      {...footerDate()}
    />, [content])

  const attachId = () => props.eleId ? { id: props.eleId } : {}

  const style = () => {
    if (props.elementType === DataType.ElementType.FieldHeader) {
      if (props.editable) return styles.separatorModule
      return styles.separatorModulePresentor
    }
    if (props.isNested && isTemplate) return styles.templateNestedPanel
    if (props.isNested) return styles.nestedModulePanel
    if (isTemplate) return styles.templatePanel
    return styles.modulePanel
  }

  const displayFooter = () => {
    if (props.elementType === DataType.ElementType.FieldHeader) return <></>
    if (isTemplate) return <></>
    if (props.isNested) return <></>
    return genFooter
  }
  return (
    <div className={style()} {...attachId()}>
      {genHeader}
      {genDescription}
      {genContext}
      {displayFooter()}
    </div>
  )
}

ModulePanel.defaultProps = {
  timeSeries: false
} as Partial<ModulePanelProps>
