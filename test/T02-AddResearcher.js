/* ******************* AUXILIAR FUNCTIONS *********************** */
/* Generate random String */
function getRandomString(characterLength) {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < characterLength; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomText;
};

/* Generate random number */
function getRandomNumber(numberLength) {
    var randomNumber = "";
    var possible = "0123456789";
    for (var i = 0; i < numberLength; i++)
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomNumber;
};


describe('Add researcher', function () {
	it('should add a new researcher', function (){
		
		/* Accedemos al recurso donde se encuentran todos los investigadores */
    	browser.get("http://localhost:8080/#!/researchers");

		element.all(by.repeater('researcher in researchers')).then(function (initialResearchers){
				browser.driver.sleep(2000);
	
				element(by.model('newResearcher.name')).sendKeys(getRandomString(15));
				element(by.model('newResearcher.phone')).sendKeys(getRandomNumber(9));
				element(by.model('newResearcher.orcid')).sendKeys(getRandomString(10));
				element(by.model('newResearcher.researcherId')).sendKeys(getRandomString(10));
				element(by.model('newResearcher.link')).sendKeys(getRandomString(10));
				element(by.model('newResearcher.idGroup')).sendKeys(getRandomString(10));
				element(by.model('newResearcher.idDepartment')).sendKeys(getRandomString(10));
				element(by.model('newResearcher.professionalSituation')).sendKeys(getRandomString(10));
				
				element(by.buttonText('Add Researcher')).click().then(function (){

					element.all(by.repeater('researcher in researchers')).then(function (researchers){
						expect(researchers.length).toEqual(initialResearchers.length+1);
					});
				
				});
			
		});
	});
});