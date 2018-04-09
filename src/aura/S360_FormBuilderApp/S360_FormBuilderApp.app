<aura:application access="GLOBAL" implements="forceCommunity:availableForAllPageTypes" template="S360_FA:S360_FormBuilderAppTemplate" extends="force:slds">
    
    
    <!-- url param attributes -->
    <aura:attribute name="formname" type="String" default=""/>
    
    <style>
        .inline-dom{
        	display:inline-block !important;
        }
    </style>
    
    <c:S360_FormBuilderMain aura:id="S360_FormBuilderMain" formConfigName="{!v.formname}"/>
    
  
</aura:application>