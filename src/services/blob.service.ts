import { Injectable, Logger } from '@nestjs/common';
import {
    AzureStorageFileInterceptor,
    AzureStorageService,
    UploadedFileMetadata,
} from '@nestjs/azure-storage';
import * as fs from 'fs';
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');

@Injectable()
export class BlobService {
    constructor(private readonly azureStorage: AzureStorageService) { }

    async upload(file: string) {
        const AZURE_STORAGE_CONNECTION_STRING =
            process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw Error("Azure Storage Connection string not found");
        }

        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            AZURE_STORAGE_CONNECTION_STRING
        );

        const containerClient = blobServiceClient.getContainerClient("upload-files");

        const blockBlobClient = containerClient.getBlockBlobClient(file);
        Logger.log("\nUploading to Azure storage as blob:\n\t", "upload-files");
        const buffer = fs.readFileSync(file);
        const data = buffer.toString();
        Logger.log(`Send to Azure: ${data}`);

        const uploadBlobResponse = blockBlobClient.upload(data, data.length);
        Logger.log(
            "Blob was uploaded successfully.");
    }
}
