# webapp-stats-backend
backend handler for webapp-stats. does the job of receiving stats packages and feeding them to SQL server


## deployment
```
gcloud run deploy webapp-stats-chewing-machine --image europe-north1-docker.pkg.dev/mlink-test/gcf-artifacts --region=europe-north1 --project=mlink-test

gcloud run services update-traffic webapp-stats-chewing-machine --to-latest
```