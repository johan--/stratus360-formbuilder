global class S360_attachment4Extractor {
    @InvocableMethod(label='S360_attachment4Extractor')
    global static List<List<Attachment>> extractAttachment(List<ExtractAttachmentRequest> data) {
        System.debug(data);
        List<List<Attachment>> result = new List<List<Attachment>>();
        List<Attachment> tmpAttachments = new List<Attachment>();
        
        if(data.size() > 0){
            ExtractAttachmentRequest input = data[0];
            
            System.debug(input);
            
            if(input.attachments != ''){
				List<Object> listOfAttachments = (List<Object>)JSON.deserializeUntyped(input.attachments);
                System.debug(listOfAttachments);
                for(Object item : listOfAttachments){
                    if(item != null){
                        Map<String, Object> attchData = (Map<String, Object>)item;
                        
                        if(attchData.get('id') == null){
                         	Attachment attch = new Attachment();
                            attch.Body = EncodingUtil.base64Decode((string)attchData.get('contents'));
                            attch.Name = (string)attchData.get('name');
                            attch.ParentId = input.parentId;
                            
                            tmpAttachments.add(attch);   
                        }
                    }
                }
                
                insert tmpAttachments;
                result.add(tmpAttachments);
            }
        }
        
        
        return result;
    }
    
    global class ExtractAttachmentRequest{
        @InvocableVariable(required=true)
		global String parentId;
        
        @InvocableVariable(required=true)
		global String attachments;
    }
}