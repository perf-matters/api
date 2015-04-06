# Perf-matters API

Website performance metrics REST API

## Instalation

```
npm i
```

## Run service API

```
npm run api
```

## Service API:

Route:  ```/metrics/har```
Method:  ```GET```
Parameters:
```
serviceUrl = [Encoded service url]
connectionType = [3G, 4G, cable]
hookUrl = [Encoded service url]
connection = {
    "downstreamKbps": Integer,
    "upstreamKbps": Integer,
    "latency": Integer
}
```

Returns 200 if request was successfully added to queue.
When performance data is ready, it is sent back to given hookUrl with:

Method: ```PUT```
Headers: ```Content-Type: application/json```
Body:
```
{
    request: {
        serviceUrl: '',
        hookUrl: '',
        connectionType: {
            downstreamKbps: Integer,
            upstreamKbps: Integer,
            latency: Integer
        },
        timing: {
            messageQueried: timestamp,
            performanceMetricsDone: timestamp,
            hookDelivery: timestamp
        }
    },
    HAR: {}
}
```
