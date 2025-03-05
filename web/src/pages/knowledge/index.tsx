import { useInfiniteFetchKnowledgeList } from '@/hooks/knowledge-hooks';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Empty,
  Flex,
  Input,
  Segmented,
  Skeleton,
  Space,
  Spin,
} from 'antd';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSaveKnowledge } from './hooks';
import KnowledgeCard from './knowledge-card';
import KnowledgeCreatingModal from './knowledge-creating-modal';

import { LayoutGrid, LayoutList } from 'lucide-react';
import { useMemo, useState } from 'react';
import styles from './index.less';

// View mode types
export enum ViewMode {
  List = 'list',
  Icons = 'icons',
}

const KnowledgeList = () => {
  const { data: userInfo } = useFetchUserInfo();
  const { t } = useTranslation('translation', { keyPrefix: 'knowledgeList' });
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.List); // Default to list view
  const {
    visible,
    hideModal,
    showModal,
    onCreateOk,
    loading: creatingLoading,
  } = useSaveKnowledge();
  const {
    fetchNextPage,
    data,
    hasNextPage,
    searchString,
    handleInputChange,
    loading,
  } = useInfiniteFetchKnowledgeList();

  const nextList = useMemo(() => {
    const list =
      data?.pages?.flatMap((x) => (Array.isArray(x.kbs) ? x.kbs : [])) ?? [];
    return list;
  }, [data?.pages]);

  const total = useMemo(() => {
    return data?.pages.at(-1).total ?? 0;
  }, [data?.pages]);

  return (
    <Flex className={styles.knowledge} vertical flex={1} id="scrollableDiv">
      <div className={styles.topWrapper}>
        <div>
          <span className={styles.title}>
            {t('welcome')}, {userInfo.nickname}
          </span>
          <p className={styles.description}>{t('description')}</p>
        </div>
        <Space size={'large'}>
          <Segmented
            options={[
              {
                label: (
                  <div style={{ padding: '0 6px' }}>
                    <LayoutList size={16} />
                    <div>List</div>
                  </div>
                ),
                value: ViewMode.List,
              },
              {
                label: (
                  <div style={{ padding: '0 6px' }}>
                    <LayoutGrid size={16} />
                    <div>Icons</div>
                  </div>
                ),
                value: ViewMode.Icons,
              },
            ]}
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
          />
          <Input
            placeholder={t('searchKnowledgePlaceholder')}
            value={searchString}
            style={{ width: 220 }}
            allowClear
            onChange={handleInputChange}
            prefix={<SearchOutlined />}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className={styles.topButton}
          >
            {t('createKnowledgeBase')}
          </Button>
        </Space>
      </div>
      <Spin spinning={loading}>
        <InfiniteScroll
          dataLength={nextList?.length ?? 0}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={!!total && <Divider plain>{t('noMoreData')} 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <Flex
            gap={'large'}
            wrap="wrap"
            className={`${styles.knowledgeCardContainer} ${
              viewMode === ViewMode.List ? styles.listView : styles.gridView
            }`}
          >
            {nextList?.length > 0 ? (
              nextList.map((item: any, index: number) => {
                return (
                  <div
                    className={
                      viewMode === ViewMode.List
                        ? styles.listItem
                        : styles.gridItem
                    }
                    key={`${item?.name}-${index}`}
                  >
                    <KnowledgeCard item={item} viewMode={viewMode} />
                  </div>
                );
              })
            ) : (
              <Empty className={styles.knowledgeEmpty}></Empty>
            )}
          </Flex>
        </InfiniteScroll>
      </Spin>
      <KnowledgeCreatingModal
        loading={creatingLoading}
        visible={visible}
        hideModal={hideModal}
        onOk={onCreateOk}
      ></KnowledgeCreatingModal>
    </Flex>
  );
};

export default KnowledgeList;
