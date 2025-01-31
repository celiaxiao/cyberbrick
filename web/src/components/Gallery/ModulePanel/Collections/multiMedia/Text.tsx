/**
 * Created by Jacob Xie on 10/3/2020.
 */

import { useState } from "react"

import { TextEditorModifier, TextEditorPresenter } from "@/components/TextEditor"
import { ModuleGenerator } from "../../Generator/ModuleGenerator"
import { ModuleEditorField, ModulePresenterField } from "../../Generator/data"
import * as DataType from "../../../GalleryDataType"
import _ from "lodash";


const EditorField = (props: ModuleEditorField) => {
  const [content, setContent] = useState<DataType.Content | undefined>(props.content)

  const onChangeContent = (value: string) => {
    // console.log(content)
    const ctt = //only update data.text property
      { ...content, data: { ...content?.data, text: value }, date: content?.date || DataType.today() }
    const ctWithDb = { ...ctt, storageType: DataType.StorageType.MONGO }
    // console.log(ctWithDb)
    setContent(ctWithDb)
    props.updateContent(ctWithDb)
  }

  return (
    <TextEditorModifier
      onChange={onChangeContent}
      content={content && content.data ? content.data.text : null}
      styling={props.styling}
      style={{ height: props.contentHeight ? props.contentHeight - 50 : undefined }}
    />
  )
}

const PresenterField = (props: ModulePresenterField) => {

  return <TextEditorPresenter
    content={props.content?.data?.text || ""}
    styling={props.styling}
  // styling has taken care of height! style={{ height: props.contentHeight }}
  />
}


export const Text = new ModuleGenerator(EditorField, PresenterField, true).generate()

