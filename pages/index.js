import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, Card, ResourceList, ResourceItem, TextStyle, Avatar} from '@shopify/polaris';
import {useState} from "react";

export default function Home({parsedData}) {

    console.log(parsedData)
    parsedData = parsedData.map((data, index) => {
        data.id = data._id;
        return data
    })

    const [selectedItems, setSelectedItems] = useState([]);

    const resourceName = {
        singular: 'listing',
        plural: 'listings',
    };

    const items = parsedData;

    const promotedBulkActions = [
        {
            content: 'Edit listings',
            onAction: () => console.log('Todo: implement bulk edit'),
        },
        {
            content: 'Delete listings',
            onAction: () => console.log('Todo: implement bulk delete'),
        },
    ];

    const bulkActions = [
        {
            content: 'Add tags',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },
        {
            content: 'Remove tags',
            onAction: () => console.log('Todo: implement bulk remove tags'),
        },
    ];

  return (
      <div>
        <Head>
            <title>next-mongo</title>
            <link
              rel="stylesheet"
              href="https://unpkg.com/@shopify/polaris@9.2.2/build/esm/styles.css"
            />
        </Head>
        <AppProvider i18n={enTranslations}>
          <Page title="Example app">
              <Card>
                  <ResourceList
                      resourceName={resourceName}
                      items={items}
                      renderItem={renderItem}
                      selectedItems={selectedItems}
                      onSelectionChange={setSelectedItems}
                      promotedBulkActions={promotedBulkActions}
                      bulkActions={bulkActions}
                  />
              </Card>
          </Page>
        </AppProvider>
      </div>
  )
};

function renderItem(item) {
    const {id, name, access} = item;
    const url = item.images.picture_url
    const media = <Avatar customer size="medium" name={name} source={url} />;

    return (
        <ResourceItem
            id={id}
            url={url}
            media={media}
            accessibilityLabel={`View details for ${name}`}
        >
            <h3>
                <TextStyle variation="strong">{name}</TextStyle>
            </h3>
            <div>{access}</div>
        </ResourceItem>
    );
}

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const collection = await client.db().collection("listingsAndReviews")
  let data = await collection.find({}).limit(10).toArray()
  let parsedData = JSON.parse(JSON.stringify(data))
  return {props: {parsedData}}
}
