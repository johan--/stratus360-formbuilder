<aura:application >

    <c:lts_jasmineRunner testFiles="{!join(',',
    	$Resource.mytest
    )}" />

</aura:application>
<!-- $Resource.jasmineHelloWorldTests,
$Resource.jasmineExampleTests,
$Resource.jasmineLightningDataServiceTests -->