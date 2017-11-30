describe('Delete researcher', function () {
	it('should delete a new researcher', function (){
		
		/* Accedemos al recurso donde se encuentran todos los investigadores */
    	browser.get("http://localhost:8080/#!/researchers");

		element.all(by.repeater('researcher in researchers')).then(function (initialResearchers){
				browser.driver.sleep(2000);
				
				var selectedButton = element.all(by.buttonText('Delete'));
				var displayedButtons = selectedButton.filter(function(elem) {
				   return elem.isDisplayed(); 
				});
				
				displayedButtons.first().click().then(function (){
					
					element.all(by.repeater('researcher in researchers')).then(function (researchers){
						browser.driver.sleep(2000);
						
						expect(researchers.length).toEqual(initialResearchers.length);
					});
				
				});
			
		});
		
	});
});