import { today } from "@/components/Gallery/GalleryDataType"
import { ModuleEditorField, ModulePresenterField } from "@/components/Gallery/ModulePanel/Generator/data"
import { ModuleGenerator } from "@/components/Gallery/ModulePanel/Generator/ModuleGenerator"
import { useEffect, useState } from "react"
import { tabItem } from "./data"
import { NestedSimpleModuleEditor } from "./Editor"
import './style.css'
import { NSMid } from "./util"
const defaultItems: tabItem[] = [0].map(function (i) {
    return {
        i: today(),
        x: i,
        y: 0,
        w: 1,
        h: 1,
        autoSize: true,
        static: false,
    }
})
const defaultData = { tabItems: defaultItems, currIndex: defaultItems[0].i }
const EditorField = (props: ModuleEditorField) => {
    /* content type: 
    currIndex: string (used to indicate the tab when entering)
    tabItem: tabItem[]: 
    for each item:
        id: i
        layout attribute: x y w h

        tab content attribute:
            tabContent: the content that will be displayed for a tab item
            tabType: the type of the content
            minDim: the minimal length between width and height. Used to calculate an item's font-size

        module: SimpleEmbededModule {
        name: string,
        timeSeries: boolean,
        elementType: ElementType,
        content?: Content
    }
    */
    let tempIndex = props.content?.data?.currIndex
    if (!tempIndex) {
        tempIndex = defaultData.currIndex
    }

    let tempItems: tabItem[] = props.content?.data?.tabItems
    if (!tempItems || tempItems.length === 0) {
        tempItems = defaultData.tabItems
        tempIndex = defaultData.currIndex
    }

    const [items, setItems] = useState<tabItem[]>(tempItems)
    const [currIndex, setCurrIndex] = useState(tempIndex)
    const [saveCount, setSaveCount] = useState(0)


    useEffect(() => {
        props.updateContent({
            ...props.content, date: props.content?.date || today(),
            data: { tabItems: items, currIndex: currIndex }
        })
        // console.log(props.content)
    }, [saveCount])
    return (
        <div id={NSMid}>
            <NestedSimpleModuleEditor
                currIndex={currIndex}
                setCurrIndex={setCurrIndex}
                items={items as tabItem[]}
                setItems={setItems}
                setSaveCount={setSaveCount}
                fetchStoragesFn={props.fetchStorages!}
                fetchTableListFn={props.fetchTableList!}
                fetchTableColumnsFn={props.fetchTableColumns!}
                fetchQueryDataFn={props.fetchQueryData!}
                updateContentFn={props.updateContent}
                editable={true}
                styling={props.styling}
                NSMid={NSMid}
                contentHeight={props.contentHeight}
                fetchContentFn={props.fetchContentFn!}
                fetchContentDatesFn={props.fetchContentDatesFn!}
            />
        </div>
    )
}

const PresenterField = (props: ModulePresenterField) => {
    let tempItems: tabItem[] = []
    if (props.content) {
        tempItems = props.content.data.tabItems as tabItem[]
    } else tempItems = []

    let tempIndex = ""
    if (props.content) {
        tempIndex = props.content.data.currIndex
    }

    const [items, setItems] = useState<tabItem[]>(tempItems)
    const [currIndex, setCurrIndex] = useState(tempIndex)
    const [saveCount, setSaveCount] = useState(0)

    /**
     * when PresenterField first mounted, it's parent haven't mounted, so there's no
     * content. When parent received content, update the items state for presentorField
    */
    useEffect(() => {
        // console.log(props.content?.data?.tabItems)
        setItems(props.content?.data?.tabItems)
    }, [props.content?.data?.tabItems])

    useEffect(() => {
        setCurrIndex(props.content?.data?.currIndex)
    }, [props.content?.data?.currIndex])

    /**
     * update currIndex
     */
    useEffect(() => {
        // console.log(props.content)
        props.updateContent({ ...props.content, date: today(), data: { tabItems: items, currIndex: currIndex } })
        // console.log(props.content)
    }, [saveCount])

    //use Editor and set editable to false so that it can receive and update the new content fetched from db
    return (props.content?.data?.tabItems ?
        <div className={props.styling}>
            <NestedSimpleModuleEditor
                items={items}
                currIndex={currIndex}
                setCurrIndex={setCurrIndex}
                setItems={setItems}
                editable={false}
                styling={props.styling}
                NSMid={NSMid}
                contentHeight={props.contentHeight}
                fetchStoragesFn={() => Promise.resolve([])}
                fetchTableColumnsFn={(storageId, tableName) => Promise.resolve([])}
                fetchTableListFn={(id) => Promise.resolve([])}
                fetchQueryDataFn={props.fetchQueryData!}
                updateContentFn={props.updateContent}
                setSaveCount={setSaveCount}

                fetchContentFn={props.fetchContentFn!}
                fetchContentDatesFn={props.fetchContentDatesFn!}
            />
        </div> : <></>)
}
export const NestedSimpleModule = new ModuleGenerator(EditorField, PresenterField).generate()