import React from 'react';
import Select from 'react-select';

import TypeComponent from './subcomponents/Type-component';
import NeedsComponent from './subcomponents/Needs-component';
import CircumstancesComponent from './subcomponents/Circumstances-component';
import AreaComponent from './subcomponents/Area-component';
import PersonasComponent from './subcomponents/Personas-component';
import AnswersQuestionComponent from './subcomponents/AnswersQuestion-component';
import SearchButton from '../../../shared/Elements/SearchButton';

export default class SearchMethodContent extends React.Component {

    options = [
        { value: "collapse_type", label: "Type of Service", actv: false },
        { value: "collapse_need", label: "Needs", actv: false },
        { value: "collapse_circumstances", label: "Circumstances", actv: false },
        { value: "collapse_area", label: "Area", actv: false },
        { value: "collapse_personas", label: "Personas", actv: false },
        { value: "collapse_aq", label: "Questions & Answers", actv: false },
    ]

    handleSelect = (item) => {
        window.$(`#${item.value}`).collapse('show');
        window.$(`#${item.value}`).on('shown.bs.collapse', function () {
            window.location.href = `#menuList`
        })
    }

    render() {
        return (
            <>
                <SearchButton />
                {window.innerWidth < 992 && window.innerWidth > 767 ?
                    <div className="w-100 d-flex justify-content-center">
                        {/* Method 2 */}
                        < ul className="d-flex mt-2" id="menuList">
                            {this.options.map((item, i) => (
                                <li key={i} className="btn btn-link btn-sm d-flex justify-content-center" id={`${item.value}Tab`} onClick={() => this.handleSelect(item)}>
                                    <p className="mb-0 text-nowrap">{item.label}</p>
                                </li>)
                            )}
                        </ul>
                    </div>
                    :
                    <>
                        <div className="mx-3 my-2" id="menuList">
                            <label htmlFor="methodSelect">Select a search method:</label>
                            <Select
                                id="methodSelect"
                                isSearchable={false}
                                isClearable={false}
                                defaultValue={0}
                                options={this.options}
                                onChange={this.handleSelect}
                            />
                        </div>
                    </>
                }


                {/* <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade " id="collapse_type" role="tabpanel" aria-labelledby="collapse_typeTab">
                        <TypeComponent />
                    </div>
                    <div className="tab-pane fade " id="collapse_need" role="tabpanel" aria-labelledby="collapse_needTab">
                        <NeedsComponent />
                    </div>
                    <div className="tab-pane fade " id="collapse_circumstances" role="tabpanel" aria-labelledby="collapse_circumstancesTab">
                        <CircumstancesComponent />
                    </div>
                    <div className="tab-pane fade " id="collapse_type" role="tabpanel" aria-labelledby="collapse_typeTab">
                        <AreaComponent />
                    </div>
                    <div className="tab-pane fade " id="collapse_type" role="tabpanel" aria-labelledby="collapse_typeTab">
                        <PersonasComponent />
                    </div>
                    <div className="tab-pane fade " id="collapse_type" role="tabpanel" aria-labelledby="collapse_typeTab">
                        <AnswersQuestionComponent />
                    </div>
                </div> */}
                {/* Origina Method */}
                {/* <div className="row">
                    <div className="col-sm-4 m-0 p-0 align-content-stretch">
                        <AccordionButton link="collapse_type" id="type" name="Type of Service" />
                    </div>
                    <div className="col-sm-4 m-0 p-0 align-content-stretch">
                        <AccordionButton link="collapse_need" id="need" name="Needs" />
                    </div>
                    <div className="col-sm-4 m-0 p-0 align-content-stretch">
                        <AccordionButton link="collapse_circumstances" id="circumstances" name="Circumstances" />
                    </div>
                </div >
                <div className="row">
                    <div className="col-sm-4 m-0 p-0 align-content-stretch">
                        <AccordionButton link="collapse_area" id="area" name="Area" />
                    </div>
                    <div className="col-sm-4 m-0 p-0 align-content-stretch">
                        <AccordionButton link="collapse_personas" id="personas" name="Personas" />
                    </div>
                    <div className="col-sm-4 m-0 p-0 align-content-stretch">
                        <AccordionButton link="collapse_aq" id="aq" name="Question &amp; Answer" />
                    </div>
                </div> */}
                <div id="collapsables">
                    <hr className="mx-0 my-0" />
                    <div id="collapse_type" className="collapse" aria-labelledby="type" data-parent="#searchMethod">
                        <div>
                            <TypeComponent />
                        </div>
                    </div>

                    <div id="collapse_need" className="collapse" aria-labelledby="need" data-parent="#searchMethod">
                        <div>
                            <NeedsComponent />
                        </div>
                    </div>

                    <div id="collapse_circumstances" className="collapse" aria-labelledby="circumstances" data-parent="#searchMethod">
                        <div>
                            <CircumstancesComponent />
                        </div>
                    </div>

                    <div id="collapse_area" className="collapse" aria-labelledby="area" data-parent="#searchMethod">
                        <div>
                            <AreaComponent />
                        </div>
                    </div>

                    <div id="collapse_personas" className="collapse" aria-labelledby="personas" data-parent="#searchMethod">
                        <div>
                            <PersonasComponent />
                        </div>
                    </div>

                    <div id="collapse_aq" className="collapse" aria-labelledby="aq" data-parent="#searchMethod">
                        <div>
                            <AnswersQuestionComponent />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}