import { useConcent } from 'concent'
import { history } from 'umi'
import { stringify } from 'querystring'
import QrCode from '@/components/QrCode'
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table'
import React, { useRef, useCallback, useMemo, useState } from 'react'
import { Button, Modal, message, Space, Row, Col, Dropdown, Menu, Select } from 'antd'
import { PlusOutlined, DeleteOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons'
import { getContents, deleteContent, batchDeleteContent } from '@/services/content'
import { ContentCtx } from 'typings/store'
import { getTableColumns } from '@/pages/project/content/columns'
import ContentTableSearchForm from '@/pages/project/content/SearchForm'
import { exportData, formatSearchParams } from '@/pages/project/content/tool'
import { useSetState } from 'react-use'
import { getProjectId, redirectTo } from '@/utils'
import ActivityChannels from './Channel'

const { Option } = Select

// 不能支持搜索的类型
const negativeTypes = ['File', 'Image']

/**
 * 内容展示表格
 */
export const ActivityTable: React.FC<{
  currentSchema: Schema
}> = (props) => {
  const { currentSchema } = props
  const qrCodeRef = useRef<any>()
  const ctx = useConcent<{}, ContentCtx>('content')
  const [{ activityId }, setState] = useSetState({
    activityId: '',
  })
  const projectId = getProjectId()

  // 检索的字段
  const { searchFields, searchParams } = ctx.state

  // 表格引用，重置、操作表格
  const tableRef = useRef<ActionType>()

  // 表格数据请求
  const tableRequest = useCallback(
    async (
      params: { pageSize: number; current: number; [key: string]: any },
      sort: any,
      filter: any
    ) => {
      const { pageSize, current } = params
      const resource = currentSchema.collectionName

      // 搜索参数
      const fuzzyFilter = formatSearchParams(searchParams, currentSchema)

      try {
        const { data = [], total } = await getContents(projectId, resource, {
          sort,
          filter,
          pageSize,
          fuzzyFilter,
          page: current,
        })

        return {
          data,
          total,
          success: true,
        }
      } catch (error) {
        return {
          data: [],
          total: 0,
          success: true,
        }
      }
    },
    [searchParams]
  )

  /**
   * 搜索字段下拉菜单
   */
  const searchFieldMenu = useMemo(
    () => (
      <Menu
        onClick={({ key }) => {
          const field = currentSchema.fields.find((_) => _.name === key)
          const fieldExist = searchFields?.find((_) => _.name === key)
          if (fieldExist) {
            message.error('字段已添加，请勿重复添加')
            return
          }
          // 添加字段
          field && ctx.mr.addSearchField(field)
        }}
      >
        {currentSchema?.fields
          ?.filter((filed) => !negativeTypes.includes(filed.type))
          .map((field) => (
            <Menu.Item key={field.name}>{field.displayName}</Menu.Item>
          ))}
      </Menu>
    ),
    [currentSchema, searchFields]
  )

  // 缓存 Table Columns 配置
  const memoTableColumns: ProColumns[] = useMemo(() => {
    const columns = getTableColumns(currentSchema)

    return [
      ...columns,
      {
        title: '操作',
        width: 240,
        align: 'center',
        fixed: 'right',
        valueType: 'option',
        render: (text, row: any) => [
          <Button
            size="small"
            type="primary"
            key="edit"
            onClick={() => {
              ctx.setState({
                contentAction: 'edit',
                selectedContent: row,
              })
              redirectTo('operation/activity/edit', {
                query: {
                  upload: 'hosting',
                },
              })
            }}
          >
            编辑
          </Button>,
          <Button
            size="small"
            type="primary"
            key="edit"
            onClick={async () => {
              setState({
                activityId: row._id,
              })
              qrCodeRef.current?.show()
            }}
          >
            渠道投放
          </Button>,
          <Button
            danger
            size="small"
            key="delete"
            type="primary"
            onClick={() => {
              const modal = Modal.confirm({
                title: '确认删除此内容？',
                onCancel: () => {
                  modal.destroy()
                },
                onOk: async () => {
                  try {
                    await deleteContent(projectId, currentSchema.collectionName, row._id)
                    tableRef?.current?.reload()
                    message.success('删除内容成功')
                  } catch (error) {
                    message.error('删除内容失败')
                  }
                },
              })
            }}
          >
            删除
          </Button>,
        ],
      },
    ]
  }, [currentSchema])

  // 表格多选操作
  const tableAlerRender = useMemo(() => getTableAlertRender(projectId, currentSchema, tableRef), [
    currentSchema,
  ])

  // 表格 ToolBar
  const toolBarRender = useMemo(
    () => [
      <Dropdown overlay={searchFieldMenu} key="search">
        <Button type="primary">
          <FilterOutlined /> 增加检索
        </Button>
      </Dropdown>,
      <Button
        key="button"
        type="primary"
        icon={<PlusOutlined />}
        disabled={!currentSchema.fields?.length}
        onClick={() => {
          if (!currentSchema?._id) {
            message.error('请选择需要创建的内容类型！')
            return
          }
          ctx.setState({
            contentAction: 'create',
            selectedContent: null,
          })

          redirectTo('operation/activity/edit', {
            query: {
              upload: 'hosting',
            },
          })
        }}
      >
        新建
      </Button>,
      <ActivityChannels key="channel" />,
    ],
    [currentSchema, searchParams, searchFields]
  )

  // 从 url 获取分页条件
  const pagination = useMemo(() => {
    const { query } = history.location
    return {
      showSizeChanger: true,
      defaultCurrent: Number(query?.current) || 1,
      defaultPageSize: Number(query?.pageSize) || 10,
      pageSizeOptions: ['10', '20', '30', '50'],
    }
  }, [])

  return (
    <>
      {/* 搜索表单 */}
      <ContentTableSearchForm
        schema={currentSchema}
        onSearch={(params) => {
          ctx.setState({
            searchParams: params,
          })
          setPageQuery(1, 10)
          tableRef?.current?.reload(true)
        }}
      />

      {/* 数据 Table */}
      <ProTable
        rowKey="_id"
        search={false}
        rowSelection={{
          columnWidth: '64px',
        }}
        actionRef={tableRef}
        dateFormatter="string"
        scroll={{ x: 'max-content' }}
        request={tableRequest}
        columns={memoTableColumns}
        toolBarRender={() => toolBarRender}
        tableAlertRender={tableAlerRender}
        pagination={{
          ...pagination,
          // 翻页时，将分页数据保存在 URL 中
          onChange: (current = 1, pageSize = 10) => {
            setPageQuery(current, pageSize)
          },
        }}
      />

      <QrCode activityId={activityId} actionRef={qrCodeRef} />
    </>
  )
}

/**
 * Table 批量操作
 */
const getTableAlertRender = (projectId: string, currentSchema: Schema, tableRef: any) => ({
  intl,
  selectedRowKeys,
  selectedRows,
}: {
  intl: any
  selectedRowKeys: any[]
  selectedRows: any[]
}) => {
  // 导出文件类型
  const [fileType, setExportFileType] = useState<'json' | 'csv'>('json')

  return (
    <Row>
      <Col flex="0 0 auto">
        <Space>
          <span>已选中</span>
          <a style={{ fontWeight: 600 }}>{selectedRowKeys?.length}</a>
          <span>项</span>
        </Space>
      </Col>
      <Col flex="1 1 auto" style={{ textAlign: 'right' }}>
        <Space>
          <Button
            danger
            size="small"
            type="primary"
            onClick={() => {
              const modal = Modal.confirm({
                title: '确认删除选中的内容？',
                onCancel: () => {
                  modal.destroy()
                },
                onOk: async () => {
                  try {
                    const ids = selectedRows.map((_: any) => _._id)
                    await batchDeleteContent(projectId, currentSchema.collectionName, ids)
                    tableRef?.current?.reload()
                    message.success('删除内容成功')
                  } catch (error) {
                    message.error('删除内容失败')
                  }
                },
              })
            }}
          >
            <DeleteOutlined /> 删除文档
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              const modal = Modal.confirm({
                title: '确认导出选中的内容？',
                content: (
                  <Select defaultValue="json" onChange={setExportFileType} className="mt-3">
                    <Option value="csv">导出为 CSV 文件</Option>
                    <Option value="json">导出为 JSON 文件</Option>
                  </Select>
                ),
                onCancel: () => {
                  modal.destroy()
                },
                onOk: async () => {
                  try {
                    await exportData(selectedRows, fileType)
                    message.success('导出数据成功')
                  } catch (error) {
                    message.error('导出数据失败')
                  }
                },
              })
            }}
          >
            <ExportOutlined /> 导出数据
          </Button>
        </Space>
      </Col>
    </Row>
  )
}

/**
 * 修改、添加 URL 中的 pageSize 和 current 参数
 */
const setPageQuery = (current = 1, pageSize = 10) => {
  const { pathname, query } = history.location

  history.replace({
    pathname,
    search: stringify({
      ...query,
      pageSize,
      current,
    }),
  })
}
