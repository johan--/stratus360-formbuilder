<aura:application >

    <c:lts_mochaRunner testFiles="{!join(',', 
    	$Resource.mochaExampleTests,
        $Resource.mytest
    )}" />

</aura:application>